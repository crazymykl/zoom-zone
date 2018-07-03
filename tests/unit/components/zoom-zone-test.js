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

test('respects minimum scale', function (assert) {
  assert.expect(1);

  this.set("scale", 4.0);
  this.set("minScale", 5.0);

  this.render(hbs`{{#zoom-zone scale=scale minScale=minScale headerTemplate='components/zoom-zone-header'}}
    <div style='height: 300px; width: 200px; background-color: red'></div>
  {{/zoom-zone}}`);

  Ember.run(() => this.$('.zoom-out').click());

  assert.equal(this.get("scale"), 5.0);
});

test('respects maximum scale', function (assert) {
  assert.expect(1);

  this.set("scale", 6.0);
  this.set("maxScale", 5.0);

  this.render(hbs`{{#zoom-zone scale=scale maxScale=maxScale headerTemplate='components/zoom-zone-header'}}
    <div style='height: 300px; width: 200px; background-color: red'></div>
  {{/zoom-zone}}`);

  Ember.run(() => this.$('.zoom-in').click());

  assert.equal(this.get("scale"), 5.0);
});

test('respects increment', function (assert) {
  assert.expect(2);

  this.set("scale", 1.0);

  this.render(hbs`{{#zoom-zone scale=scale increment=increment headerTemplate='components/zoom-zone-header'}}
    <div style='height: 300px; width: 200px; background-color: red'></div>
  {{/zoom-zone}}`);

  this.set("increment", 1.0);
  Ember.run(() => this.$('.zoom-in').click());

  assert.equal(this.get("scale"), 2.0);

  this.set("increment", 0.5);
  Ember.run(() => this.$('.zoom-out').click());
  assert.equal(this.get("scale"), 1.5);

});

test('it pans', function (assert) {
  assert.expect(3);

  this.render(hbs`{{#zoom-zone scale=scale panX=panX panY=panY}}
    <div style='height: 300px; width: 200px; background-color: red'></div>
  {{/zoom-zone}}`);

  Ember.run(() => {
    this.$('.zoom-content').trigger('panstart');

    this.$('.zoom-content').trigger(new $.Event('pan', {
      originalEvent: {
        gesture: {
          deltaX: 100,
          deltaY: 150,
          scale: 1
        }
      }
    }));
  });

  assert.equal(this.get("scale"), 2.0);
  assert.equal(this.get("panX"), 300);
  assert.equal(this.get("panY"), 300);
});

test('it pinch-zooms', function (assert) {
  assert.expect(3);

  this.set("scale", 2);
  this.set("panX", 200);
  this.set("panY", 150);

  this.render(hbs`{{#zoom-zone scale=scale panX=panX panY=panY}}
    <div style='height: 300px; width: 200px; background-color: red'></div>
  {{/zoom-zone}}`);

  Ember.run(() => {
    this.$('.zoom-content').trigger('pinchstart');

    this.$('.zoom-content').trigger(new $.Event('pinch', {
      originalEvent: {
        gesture: {
          deltaX: 0,
          deltaY: 0,
          scale: 0.5
        }
      }
    }));
  });

  assert.equal(this.get("scale"), 1);
  assert.equal(this.get("panX"), 200);
  assert.equal(this.get("panY"), 150);
});

test('it pinch-zooms on wierd sized content', function (assert) {
  assert.expect(3);

  this.set("scale", 2);
  this.set("panX", -100);
  this.set("panY", 250);

  this.render(hbs`{{#zoom-zone scale=scale panX=panX panY=panY}}
    <div style='height: 100px; width: 800px; background-color: red'></div>
  {{/zoom-zone}}`);

  Ember.run(() => {
    this.$('.zoom-content').trigger('pinchstart');

    this.$('.zoom-content').trigger(new $.Event('pinch', {
      originalEvent: {
        gesture: {
          deltaX: 0,
          deltaY: 0,
          scale: 0.5
        }
      }
    }));
  });

  assert.equal(this.get("scale"), 1);
  assert.equal(this.get("panX"), -100);
  assert.equal(this.get("panY"), 250);
});
