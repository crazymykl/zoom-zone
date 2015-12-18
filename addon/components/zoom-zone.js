import Ember from 'ember';

export default Ember.Component.extend({
  headerTemplate: null,
  footerTemplate: null,
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

  didInsertElement() {
    const content = this.$('.zoom-viewport > .zoom-content');
    const scale = this.get('scale');

    this._super(...arguments);

    Ember.run.scheduleOnce('afterRender', () => {
      this.set('$viewport', content.parent());
      this.set('$content', content);
      this.set('originalWidth', content.width());
      this.set('originalHeight', content.height());

      content.panzoom({
        minScale: this.get('minScale'),
        maxScale: this.get('maxScale'),
        increment: this.get('increment'),
        onEnd: () => this.zoomed()
      });
      content.on('mousedown touchstart', 'a', (e) => e.stopImmediatePropagation());

      content.panzoom('pan', this.get('panX'), this.get('panY'));
      if(scale) { this.zoom(scale); }
      else { this.zoomFit(); }
    });
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

    content.panzoom('pan', dx, dy);
    this.zoom(ratio);
  },

  zoom(ratio) {
    const content = this.get('$content');

    content.panzoom('zoom', ratio);
    this.zoomed();
  },

  zoomed() {
    const content = this.get('$content');
    const [scale, , , , x, y] = content.panzoom('getMatrix');

    this.set('scale', +scale);
    this.set('width', this.get('originalWidth') * scale);
    this.set('height', this.get('originalHeight') * scale);
    this.set('panX', +x);
    this.set('panY', +y);
  },

  actions: {
    zoomIn:  function () { this.zoom(false); },
    zoomOut: function () { this.zoom(true); },
    zoomFit: function () { this.zoomFit(); }
  }
});
