import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, triggerEvent } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('ZoomZoneComponent', function(hooks) {
  setupRenderingTest(hooks);

  test('it scales to fit by default', async function(assert) {
    assert.expect(3);

    await render(hbs`{{#zoom-zone scale=scale panX=panX panY=panY}}
      <div style='height: 300px; width: 200px; background-color: red'></div>
    {{/zoom-zone}}`);

    assert.equal(this.get("scale"), 2);
    assert.equal(this.get("panX"), 200);
    assert.equal(this.get("panY"), 150);
  });

  test('it keeps passed in scales', async function(assert) {
    assert.expect(3);

    this.set("scale", 3);
    this.set("panX", -23);
    this.set("panY", 99);

    await render(hbs`{{#zoom-zone scale=scale panX=panX panY=panY}}
      <div style='height: 300px; width: 200px; background-color: red'></div>
    {{/zoom-zone}}`);

    assert.equal(this.get("scale"), 3);
    assert.equal(this.get("panX"), -23);
    assert.equal(this.get("panY"), 99);
  });

  test('it zooms in via button', async function(assert) {
    assert.expect(3);

    await render(hbs`{{#zoom-zone scale=scale panX=panX panY=panY headerTemplate='components/zoom-zone-header'}}
      <div style='height: 300px; width: 200px; background-color: red'></div>
    {{/zoom-zone}}`);

    run(async () => await click('.zoom-in'));

    assert.equal(this.get("scale"), 2);
    assert.equal(this.get("panX"), 200);
    assert.equal(this.get("panY"), 150);
  });

  test('it zooms out via button', async function(assert) {
    assert.expect(3);

    await render(hbs`{{#zoom-zone scale=scale panX=panX panY=panY headerTemplate='components/zoom-zone-header'}}
      <div style='height: 300px; width: 200px; background-color: red'></div>
    {{/zoom-zone}}`);

    await click('.zoom-out');

    assert.equal(this.get("scale"), 1.75);
    assert.equal(this.get("panX"), 200);
    assert.equal(this.get("panY"), 150);
  });

  test('it zooms to fit via button', async function(assert) {
    assert.expect(3);

    this.set("scale", 5.0);
    this.set("panX", 2000);
    this.set("panY", -100);

    await render(hbs`{{#zoom-zone scale=scale panX=panX panY=panY headerTemplate='components/zoom-zone-header'}}
      <div style='height: 300px; width: 200px; background-color: red'></div>
    {{/zoom-zone}}`);

    await click('.zoom-fit');

    assert.equal(this.get("scale"), 2.0);
    assert.equal(this.get("panX"), 200);
    assert.equal(this.get("panY"), 150);
  });

  test('respects minimum scale', async function(assert) {
    assert.expect(1);

    this.set("scale", 4.0);
    this.set("minScale", 5.0);

    await render(hbs`{{#zoom-zone scale=scale minScale=minScale headerTemplate='components/zoom-zone-header'}}
      <div style='height: 300px; width: 200px; background-color: red'></div>
    {{/zoom-zone}}`);

    await click('.zoom-out');

    assert.equal(this.get("scale"), 5.0);
  });

  test('respects maximum scale', async function(assert) {
    assert.expect(1);

    this.set("scale", 6.0);
    this.set("maxScale", 5.0);

    await render(hbs`{{#zoom-zone scale=scale maxScale=maxScale headerTemplate='components/zoom-zone-header'}}
      <div style='height: 300px; width: 200px; background-color: red'></div>
    {{/zoom-zone}}`);

    await click('.zoom-in');

    assert.equal(this.get("scale"), 5.0);
  });

  test('respects increment', async function(assert) {
    assert.expect(2);

    this.set("scale", 1.0);

    await render(hbs`{{#zoom-zone scale=scale increment=increment headerTemplate='components/zoom-zone-header'}}
      <div style='height: 300px; width: 200px; background-color: red'></div>
    {{/zoom-zone}}`);

    this.set("increment", 1.0);
    await click('.zoom-in');

    assert.equal(this.get("scale"), 2.0);

    this.set("increment", 0.5);
    await click('.zoom-out');
    assert.equal(this.get("scale"), 1.5);

  });

  test('it pans', async function(assert) {
    assert.expect(3);

    await render(hbs`{{#zoom-zone scale=scale panX=panX panY=panY}}
      <div style='height: 300px; width: 200px; background-color: red'></div>
    {{/zoom-zone}}`);

    await triggerEvent('.zoom-content', 'panstart');

    await triggerEvent('.zoom-content', 'pan', {
      gesture: {
        deltaX: 100,
        deltaY: 150,
        scale: 1
      }
    });

    assert.equal(this.get("scale"), 2.0);
    assert.equal(this.get("panX"), 300);
    assert.equal(this.get("panY"), 300);
  });

  test('it pinch-zooms', async function(assert) {
    assert.expect(3);

    this.set("scale", 2);
    this.set("panX", 200);
    this.set("panY", 150);

    await render(hbs`{{#zoom-zone scale=scale panX=panX panY=panY}}
      <div style='height: 300px; width: 200px; background-color: red'></div>
    {{/zoom-zone}}`);

      await triggerEvent('.zoom-content', 'pinchstart');

      await triggerEvent('.zoom-content', 'pinch', {
          gesture: {
            deltaX: 0,
            deltaY: 0,
            scale: 0.5
          }
      });

    assert.equal(this.get("scale"), 1);
    assert.equal(this.get("panX"), 200);
    assert.equal(this.get("panY"), 150);
  });

  test('it pinch-zooms on wierd sized content', async function(assert) {
    assert.expect(3);

    this.set("scale", 2);
    this.set("panX", -100);
    this.set("panY", 250);

    await render(hbs`{{#zoom-zone scale=scale panX=panX panY=panY}}
      <div style='height: 100px; width: 800px; background-color: red'></div>
    {{/zoom-zone}}`);

      await triggerEvent('.zoom-content', 'pinchstart');

      await triggerEvent('.zoom-content', 'pinch', {
          gesture: {
            deltaX: 0,
            deltaY: 0,
            scale: 0.5
          }
      });

    assert.equal(this.get("scale"), 1);
    assert.equal(this.get("panX"), -100);
    assert.equal(this.get("panY"), 250);
  });

  test('it rotates via button', async function(assert) {
    assert.expect(3);

    this.set('rotation', 0);

    await render(
      hbs`{{#zoom-zone rotation=rotation scale=scale panX=panX panY=panY headerTemplate='components/zoom-zone-header'}}
        <div style='height: 300px; width: 200px; background-color: red'></div>
      {{/zoom-zone}}`
    );

    await click('.rotate-clockwise');

    assert.equal(this.get("panX"), 200);
    assert.equal(this.get("panY"), 150);
    assert.equal(this.get("rotation"), 5);
  });
});
