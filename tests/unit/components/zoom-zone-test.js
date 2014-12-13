import resolver from '../../helpers/resolver';
import {
  moduleForComponent,
  test
} from 'ember-qunit';

moduleForComponent('zoom-zone', 'ZoomZoneComponent', {
  // specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']
  setup: function(container) {
    container.register(
      'template:components/zoom-zone-header',
      resolver.resolve('template:components/-zoom-zone-header')
    );
  }
});

test('it renders', function() {
  expect(2);

  // creates the component instance
  var component = this.subject();
  equal(component._state, 'preRender');

  // appends the component to the page
  this.append();
  equal(component._state, 'inDOM');
});
