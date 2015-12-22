# zoom-zone [![Build Status](https://travis-ci.org/crazymykl/zoom-zone.svg)](https://travis-ci.org/crazymykl/zoom-zone) [![Ember Observer Score](http://emberobserver.com/badges/zoom-zone.svg)](http://emberobserver.com/addons/zoom-zone)

An Ember component providing a region which can be panned and zoomed.

## Installation

* `ember install zoom-zone`

## Use

This addon provides a component called `zoom-zone`. This component presents a region than can be panned and zoomed with gestures.

The following properties are supported read/write:

* headerTemplate: Sets a partial to render within the component (so these properties are available), but before the viewport. [default: _null_]
* footerTemplate: As above, but after the viewport. [default: _null_]
* activeViewport: If set, the viewport will be able to pan and zoom as well [default: _true_]
* minScale: The minimum zoom level [default: 0.1]
* maxScale: The maximum zoom level [default: 5.0]
* increment: The increment using the actions (see below) zooms by [default: 0.1]
* scale: The zoom level (Note that zooming to fit will adjust the panning as well) [default: zoom-to-fit]
* panX: The _x_ offset of the content in the viewport [default: 0]
* panY: The _y_ offset of the content in the viewport [default: 0]
* centerOnFit: If set, center the content in the viewport when zooming to fit [default: _true_]
* delay: A duration (in ms) to animate zooming caused by the `zoomIn` and `zoomOut` events [default: 250ms]

Additionally, these properties are available for reading:

* originalWidth
* originalHeight
* width
* height

These actions are available:

* zoomTo(_scale_): Sets the `scale` to the passed argument
* zoomIn: Increases the `scale` by the `increment`
* zoomOut: Decreases the `scale` by the `increment`
* zoomFit: Sets the scale to the largest value which does fits in both dimensions. Pans such that the entire content is within the viewport (either centered or aligned to the top left based on the value of `centerOnFit`)

---

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
