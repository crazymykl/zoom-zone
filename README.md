# zoom-zone [![Build Status](https://travis-ci.org/crazymykl/zoom-zone.svg)](https://travis-ci.org/crazymykl/zoom-zone) [![Ember Observer Score](http://emberobserver.com/badges/zoom-zone.svg)](http://emberobserver.com/addons/zoom-zone)

An Ember component providing a region which can be panned and zoomed.

## Installation

* `ember install zoom-zone`

## Use

This addon provides a component called `zoom-zone`. This component presents a region than can be panned and zoomed with gestures.

```hbs
{{#zoom-zone}}
  <img src="http://placehold.it/300x200" width='300' height='200'>
  {{#link-to 'foo'}}<span class='splorch' id='foo'></span>{{/link-to}}
{{/zoom-zone}}
```

The component will yield itself as the first argument to its block if one is specified.

The following properties are supported in the `zoom-zone` component

| Property         | Read | Write | Default            | Purpose
|------------------|------|-------|--------------------|--------
| `headerTemplate` | ✅   |   ✅   | `null`             | Sets a partial to render within the component (so these properties are available), but before the viewport
| `footerTemplate` | ✅   |   ✅   | `null`             | As above, but after the viewport
| `activeViewport` | ✅   |   ✅   | `true`             | If set, the viewport will be able to pan and zoom as well
| `minScale`       | ✅   |   ✅   | 0.1                | The minimum zoom level
| `maxScale`       | ✅   |   ✅   | 5.0                | The maximum zoom level
| `increment`      | ✅   |   ✅   | 0.1                | The amount the zoom increments by in the actions (see below)
| `scale`          | ✅   |   ✅   | `"zoom-to-fit"`    | The zoom level (Note that zooming to fit will adjust the panning as well)
| `panX`           | ✅   |   ✅   | 0                  | The _x_ offset of the content in the viewport
| `panY`           | ✅   |   ✅   | 0                  | The _y_ offset of the content in the viewport
| `centerOnFit`    | ✅   |   ✅   | `true`             | If set, the content will be centered in the viewport when zooming to fit
| `delay`          | ✅   |   ✅   | 250ms              | A duration (in ms) to animate zooming caused by the `zoomIn` and `zoomOut` events
| `originalWidth`  | ✅    |       | Width of content  | The original width of the zoomed content
| `originalHeight` | ✅    |       | Height of content | The original height of the zoomed content
| `width`          | ✅    |       |                   | The current width of the zoomed content
| `height`         | ✅    |       |                   | The current height of the zoomed content

These actions are available:

* `zoomTo(scale)`: Sets the `scale` to the passed argument (defaults to 1)
* `zoomIn`: Increases the `scale` by the `increment`
* `zoomOut`: Decreases the `scale` by the `increment`
* `zoomFit`: Sets the scale to the largest value which does fits in both dimensions. Pans such that the entire content is within the viewport (either centered or aligned to the top left based on the value of `centerOnFit`)

---

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
