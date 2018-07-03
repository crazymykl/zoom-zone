import Ember from 'ember';
import RecognizerMixin from 'ember-gestures/mixins/recognizers';

const {
  Component,
  run
} = Ember;

export default Component.extend(RecognizerMixin, {
  recognizers: 'pinch pan vertical-pan',
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
  panStartX: 0,
  panStartY: 0,
  scaleStart: undefined,

  panStart() {
    this.gesturedStart();
  },

  pinchStart() {
    this.gesturedStart();
  },

  pan(e) {
    this.gestured(e);
  },

  pinch(e) {
    this.gestured(e);
  },
  
  pinchMove(e) {
    this.gestured(e);
  },

  gesturedStart() {
    this.setProperties({
      panStartX: this.get('panX'),
      panStartY: this.get('panY'),
      scaleStart: this.get('scale')
    });
  },

  gestured(e){
    let {panStartX, panStartY, scaleStart, $viewport, $content, minScale, maxScale} =
      this.getProperties('panStartX', 'panStartY', 'scaleStart', '$viewport', '$content', 'minScale', 'maxScale');

    let {deltaX, deltaY, scale} = e.originalEvent.gesture;

    const [viewportWidth, viewportHeight] = [$viewport.width(), $viewport.height()];
    const [contentWidth, contentHeight] = [$content.width(), $content.height()];

    scale *= scaleStart;

    let ratio = Math.max(minScale, Math.min(scale, maxScale));

    const scaleRatio = ratio / scaleStart;
    const magicSauce = (scaleRatio - 1) / 2;
    const newX = (panStartX + deltaX) * scaleRatio - (viewportWidth - contentWidth) * magicSauce;
    const newY = (panStartY + deltaY) * scaleRatio - (viewportHeight - contentHeight) * magicSauce;

    this.setProperties({
      panX: newX,
      panY: newY,
      scale: ratio
    });
  },

  didInsertElement() {
    const viewport = this.$('.zoom-viewport');
    const content = viewport.children('.zoom-content');
    const scale = this.get('scale');

    this._super(...arguments);

    run.scheduleOnce('afterRender', () => {
      this.set('$viewport', content.parent());
      this.set('$content', content);
      this.set('originalWidth', content.width());
      this.set('originalHeight', content.height());

      if(scale) { this.zoomTo(scale); }
      else { this.zoomFit(); }

      this.didRender();
    });
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

    const x = panX * scaleRatio - (viewport.width() - content.width()) * magicSauce;
    const y = panY * scaleRatio - (viewport.height() - content.height()) * magicSauce;

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
