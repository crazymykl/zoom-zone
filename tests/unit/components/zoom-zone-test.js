import {
  moduleForComponent,
  test
} from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('zoom-zone', 'ZoomZoneComponent', {
  integration: true
});

test('it scales to fit by default', function (assert) {
  assert.expect(3);

  this.render(hbs`{{#zoom-zone scale=scale panX=panX panY=panY}}
    <div style='height: 300px; width: 200px; background-color: red'></div>
  {{/zoom-zone}}`);

  assert.equal(this.get("scale"), 2);
  assert.equal(this.get("panX"), 200);
  assert.equal(this.get("panY"), 150);
});

test('it keeps passed in scales', function (assert) {
  assert.expect(3);

  this.set("scale", 3);
  this.set("panX", -23);
  this.set("panY", 99);

  this.render(hbs`{{#zoom-zone scale=scale panX=panX panY=panY}}
    <div style='height: 300px; width: 200px; background-color: red'></div>
  {{/zoom-zone}}`);

  assert.equal(this.get("scale"), 3);
  assert.equal(this.get("panX"), -23);
  assert.equal(this.get("panY"), 99);
});

test('it zooms in via button', function (assert) {
  assert.expect(3);

  this.render(hbs`{{#zoom-zone scale=scale panX=panX panY=panY headerTemplate='components/zoom-zone-header'}}
    <div style='height: 300px; width: 200px; background-color: red'></div>
  {{/zoom-zone}}`);

  Ember.run(() => this.$('.zoom-in').click());

  assert.equal(this.get("scale"), 2.25);
  assert.equal(this.get("panX"), 200);
  assert.equal(this.get("panY"), 150);
});

test('it zooms out via button', function (assert) {
  assert.expect(3);

  this.render(hbs`{{#zoom-zone scale=scale panX=panX panY=panY headerTemplate='components/zoom-zone-header'}}
    <div style='height: 300px; width: 200px; background-color: red'></div>
  {{/zoom-zone}}`);

  Ember.run(() => this.$('.zoom-out').click());

  assert.equal(this.get("scale"), 1.75);
  assert.equal(this.get("panX"), 200);
  assert.equal(this.get("panY"), 150);
});

test('it zooms to fit via button', function (assert) {
  assert.expect(3);

  this.set("scale", 5.0);
  this.set("panX", 2000);
  this.set("panY", -100);

  this.render(hbs`{{#zoom-zone scale=scale panX=panX panY=panY headerTemplate='components/zoom-zone-header'}}
    <div style='height: 300px; width: 200px; background-color: red'></div>
  {{/zoom-zone}}`);

  Ember.run(() => this.$('.zoom-fit').click());

  assert.equal(this.get("scale"), 2.0);
  assert.equal(this.get("panX"), 200);
  assert.equal(this.get("panY"), 150);
});

test('it pans with the mouse', function (assert) {
  assert.expect(3);

  this.render(hbs`{{#zoom-zone scale=scale panX=panX panY=panY}}
    <div style='height: 300px; width: 200px; background-color: red'></div>
  {{/zoom-zone}}`);

  Ember.run(() => {
    this.$('.zoom-content').trigger(new $.Event('mousedown', {
      which: 1,
      pageX: 0,
      pageY: 0,
    }));

    this.$('.zoom-content').trigger(new $.Event('mousemove', {
      pageX: 100,
      pageY: 150,
    }));

    this.$('.zoom-content').trigger('mouseup');
  });

  assert.equal(this.get("scale"), 2.0);
  assert.equal(this.get("panX"), 300);
  assert.equal(this.get("panY"), 300);
});

test('it pans with touches', function (assert) {
  assert.expect(3);

  this.render(hbs`{{#zoom-zone scale=scale panX=panX panY=panY}}
    <div style='height: 300px; width: 200px; background-color: red'></div>
  {{/zoom-zone}}`);

  Ember.run(() => {
    this.$('.zoom-content').trigger(new $.Event('touchstart', {
      pageX: 0,
      pageY: 0,
      touches: [
        {pageX: 0, pageY: 0}
      ],
    }));

    this.$('.zoom-content').trigger(new $.Event('touchmove', {
      pageX: 100,
      pageY: 150,
      touches: [
        {pageX: 100, pageY: 150}
      ],
    }));

    this.$('.zoom-content').trigger('touchend');
  });

  assert.equal(this.get("scale"), 2.0);
  assert.equal(this.get("panX"), 300);
  assert.equal(this.get("panY"), 300);
});

test('it pinch-zooms', function (assert) {
  assert.expect(3);

  this.render(hbs`{{#zoom-zone scale=scale panX=panX panY=panY}}
    <div style='height: 300px; width: 200px; background-color: red'></div>
  {{/zoom-zone}}`);

  Ember.run(() => {
    const {left, top} = this.$('.zoom-content')[0].getBoundingClientRect();

    this.$('.zoom-content').trigger(new $.Event('touchstart', {
      pageX: 0,
      pageY: 0,
      touches: [
        {clientX: left, clientY: top},
        {clientX: left + 100, clientY: top + 100},
      ],
    }));

    this.$('.zoom-content').trigger(new $.Event('touchmove', {
      pageX: 0,
      pageY: 0,
      touches: [
        {clientX: left, clientY: top},
        {clientX: left + 100, clientY: top},
      ],
    }));

    this.$('.zoom-content').trigger('touchend');
  });

  assert.equal(+this.get("scale").toFixed(3), 1.896);
  // These two are imprecise to account for rounding differences in rendering engines
  assert.equal(Math.round(+this.get("panX")), 192);
  assert.equal(Math.round(+this.get("panY")), 85);
});
