import Ember from 'ember';

const {
  Component,
  run,
  computed,
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
      if(normalizeEvent(e).touches || e.which === 1) { startPinch(e); }
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
    });
  },

  willDestroyElement() {
    const viewport = this.get('$viewport');
    const content = this.get('$content');

    viewport.off();
    content.off();

    this._super(...arguments);
  },

  matrix: computed('panX', 'panY', 'scale', function () {
    const [scale, x, y] = [this.get('scale'), this.get('panX'), this.get('panY')];
    return `matrix(${scale}, 0, 0, ${scale}, ${x}, ${y})`;
  }),

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
    this.zoomTo(ratio);
  },

  zoomTo(ratio) {
    const content = this.get('$content');
    const [min, max] = [this.get('minScale'), this.get('maxScale')];

    if(ratio > max) { ratio = max; }
    else if(ratio < min) { ratio = min; }

    this.set('scale', ratio);
    this.set('width', this.get('originalWidth') * ratio);
    this.set('height', this.get('originalHeight') * ratio);

    content.css({transform: this.get('matrix')});
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
  const touch0 = normalizeTouches(event);
  const [scale0, x0, y0] = [
    zone.get('scale'),
    zone.get('panX') - touch0.x,
    zone.get('panY') - touch0.y
  ];

  function move(e) {
    e.preventDefault();
    run.debounce(zone, () => {
      const {x, y, distance} = normalizeTouches(normalizeEvent(e));

      zone.set('scale', scale0 * distance / touch0.distance);
      zone.set('panX', x0 + x);
      zone.set('panY', y0 + y);
      zone.zoomBy(0);
    }, 7, true);
  }

  $(document).on('mousemove touchmove', move);

  $(document).one('mouseup touchend', () =>
    $(document).off('mousemove touchmove', move)
  );
}

function normalizeEvent(event) {
  if(event.originalEvent) {
    event.touches = Array.prototype.slice.call(event.originalEvent.touches || []);
    event.pageX = event.originalEvent.pageX;
    event.pageY = event.originalEvent.pageY;
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
