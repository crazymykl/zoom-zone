import Ember from 'ember';

const {
  Component,
  run,
  $
} = Ember;

export default Component.extend({
  headerTemplate: null,
  footerTemplate: null,
  activeViewport: true,
  scale: undefined,
  minScale: 0.1,
  maxScale: 5.0,
  increment: 0.25,
  originalWidth: undefined,
  originalHeight: undefined,
  width: undefined,
  height: undefined,
  panX: 0,
  panY: 0,
  centerOnFit: true,
  delay: 250,

  didInsertElement() {
    const viewport = this.$('.zoom-viewport');
    const content = viewport.children('.zoom-content');
    const scale = this.get('scale');
    const start = (e) => {
      if(Ember.isPresent(normalizeEvent(e).touches) || e.which === 1) { startPinch(e); }
      if(e.type === 'mousedown') { e.preventDefault(); }
    };

    this._super(...arguments);

    run.scheduleOnce('afterRender', () => {
      this.set('$viewport', content.parent());
      this.set('$content', content);
      this.set('originalWidth', content.width());
      this.set('originalHeight', content.height());

      viewport.on('touchstart mousedown', {zone: this}, (e) => {
        if(this.get('activeViewport')) { start(e); }
      });

      content.on('touchstart mousedown', {zone: this}, start);

      if(scale) { this.zoomTo(scale); }
      else { this.zoomFit(); }

      this.didRender();
    });
  },

  willDestroyElement() {
    const viewport = this.get('$viewport');
    const content = this.get('$content');

    viewport.off();
    content.off();

    this._super(...arguments);
  },

  didRender() {
    const {$content, scale, panX, panY} = this.getProperties('$content', 'scale', 'panX', 'panY');
    const matrix = `matrix(${scale}, 0, 0, ${scale}, ${panX}, ${panY})`;
    if($content) { $content.css({transform: matrix}); }
  },

  zoomFit() {
    const viewport = this.get('$viewport');
    const content = this.get('$content');
    const [ratioX, ratioY] = [
      viewport.width() / content.width(),
      viewport.height() / content.height()
    ];
    const ratio = Math.min(ratioX, ratioY);
    let [dx, dy] = [
      (content.width() / 2) * (ratio - 1),
      (content.height() / 2) * (ratio - 1)
    ];

    if(this.get('centerOnFit')) {
      if(ratioX > ratioY) { dx = (viewport.width() - content.width()) / 2; }
      if(ratioX < ratioY) { dy = (viewport.height() - content.height()) / 2; }
    }

    this.set('panX', dx);
    this.set('panY', dy);
    this.set('scale', ratio);
    this.zoomTo(ratio);
  },

  zoomTo(ratio) {
    const [min, max] = [this.get('minScale'), this.get('maxScale')];

    const previousScale = this.get('scale') || 1;

    if(ratio > max) { ratio = max; }
    else if(ratio < min) { ratio = min; }

    const scaleRatio = ratio/previousScale;

    const content = this.get('$content');
    const viewport = this.get('$viewport');
    const panX = this.get('panX');
    const panY = this.get('panY');

    const magicSauce = (scaleRatio - 1) / 2;

    const x = panX * scaleRatio - (viewport.width() - content.width())*magicSauce;
    const y = panY * scaleRatio - (viewport.height() - content.height())*magicSauce;

    this.setProperties({
      scale: ratio,
      width: this.get('originalWidth') * ratio,
      height: this.get('originalHeight') * ratio,
      panX: x,
      panY: y,
    });
  },

  zoomBy(delta) {
    const content = this.get('$content');
    const delay = +this.get('delay');

    if(delay && delta) {
      content.css({transition: `${delay}ms ease`});
      setTimeout(() => content.css({transition: ''}), delay);
    }
    this.zoomTo(this.get('scale') + delta);
  },

  actions: {
    zoomTo(scale=1) { this.zoomTo(scale); },
    zoomIn() { this.zoomBy(this.get('increment')); },
    zoomOut() { this.zoomBy(-this.get('increment')); },
    zoomFit() { this.zoomFit(); }
  }
});

function startPinch(event) {
  const {zone} = event.data;
  const [min, max] = [zone.get('minScale'), zone.get('maxScale')];
  const touch0 = normalizeTouches(event);
  const [scale0, x0, y0] = [
    zone.get('scale'),
    zone.get('panX') - touch0.x,
    zone.get('panY') - touch0.y
  ];
  const content = zone.get('$content');
  const viewport = zone.get('$viewport');

  function move(e) {
    e.preventDefault();
    const {x, y, distance} = normalizeTouches(normalizeEvent(e));
    let ratio = scale0 * distance / touch0.distance;

    if(ratio > max) { ratio = max; }
    else if(ratio < min) { ratio = min; }

    const scaleRatio = ratio / scale0;
    const magicSauce = (scaleRatio - 1) / 2;
    const newX = (x0 + x) * scaleRatio - (viewport.width() - content.width()) * magicSauce;
    const newY = (y0 + y) * scaleRatio - (viewport.width() - content.width()) * magicSauce;

    zone.setProperties({
      scale: ratio,
      panX: newX,
      panY: newY,
    });
  }

  $(document).off('mousemove.zoom-zone touchmove.zoom-zone');
  $(document).one('mouseup touchend', () =>
    $(document).off('mousemove.zoom-zone touchmove.zoom-zone')
  );
  $(document).on('mousemove.zoom-zone touchmove.zoom-zone', move);
}

function normalizeEvent(event) {
  if(event.originalEvent) {
    const touches = Array.prototype.slice.call(event.originalEvent.touches || []);
    event.touches = touches;
    if(touches[0]) {
      event.pageX = touches[0].pageX;
      event.pageY = touches[0].pageY;
    } else {
      event.pageX = event.originalEvent.pageX;
      event.pageY = event.originalEvent.pageY;
    }
  }
  return event;
}

function normalizeTouches(event) {
  const {touches} = event;
  if((touches || []).length < 2) {
    return {
      x: event.pageX,
      y: event.pageY,
      distance: 1
    };
  }
  const [first, second] = touches.slice(0, 2);

  return {
    x: (first.pageX + second.pageX) / 2,
    y: (first.pageY + second.pageY) / 2,
    distance: distance(
      [first.clientX, first.clientY],
      [second.clientX, second.clientY]
    ),
  };
}

function distance(p0, p1) {
  return Math.sqrt(
     Math.pow(Math.abs(p0[0] - p1[0]), 2) +
     Math.pow(Math.abs(p0[1] - p1[1]), 2)
  );
}
