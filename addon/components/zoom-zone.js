import Ember from 'ember';

export default Ember.Component.extend({
  headerTemplate: 'components/zoom-zone-header',
  scale: undefined,
  scaleFactor: 1.25,
  originalWidth: undefined,
  originalHeight: undefined,
  width: undefined,
  height: undefined,

  didInsertElement () {
    var content;
    this.set('$viewport', Ember.$('.zoom-viewport'));
    content = this.get('$viewport').find('> .zoom-content');
    this.set('$content', content);

    this.setProperties({
      originalWidth: content.width(),
      originalHeight: content.height(),
      width: content.width(),
      height: content.height(),
    });

    if(!this.get('scale')) { this.zoomFit(); }
  },

  resize: function () {
    var scale = this.get('scale');
    var viewport = this.get('$viewport');

    this.setProperties({
      width: this.get('originalWidth') * scale,
      height: this.get('originalHeight') * scale,
    });

    this.get('$content').css({
      transform: `scale(${scale},${scale})`,
      left: Math.max(0, (viewport.width() - this.get('width')) / 2),
      top: Math.max(0, (viewport.height() - this.get('height')) / 2),
    });
  }.observes('scale'),

  zoomFit () {
    var viewport = this.get('$viewport');
    var content = this.get('$content');

    this.set('scale', Math.min(viewport.width() / content.width(), viewport.height() / content.height()));
  },

  actions: {
    zoomIn:  function () { this.set('scale', this.get('scale') * this.get('scaleFactor')); },
    zoomOut: function () { this.set('scale', this.get('scale') / this.get('scaleFactor')); },
    zoomFit: function () { this.zoomFit(); }
  }
});
