/** xhr-progress.js
 * Minimalistic progress bar for XHR/AJAX requests etc.
 * (C) 2018 Rob Kluver. MIT License.
 * Dependencies: jQuery >= 1.12.4
 */
"use strict";
var XhrProgress =
(function (options){

  /**
   * @param {object} Set options:
   *   parent - Parent element
   *   height - Height in pixels
   *   delay [ms] - Time to wait until the progress bar is shown after start() is called [not implemented]
   *   color - Color of progress bar
   *   colorFailed - Color of progress bar if failed()
   *   style - Box shadow style of bar
   *   styleFailed - Box shadow style of bar
   */

  if (options == null){
    options = {};
  }

  var defaults = {
    parent: '#xhr-progress',
    height: 2,
    delay: 1500,
    color: '#77b6ff',
    colorFailed: '#ff4f4f',
    style: '0 0 10px rgba(119, 182, 255, 0.7)',
    styleFailed: '0 0 10px rgba(255, 119, 119, 0.7)',
    paddingTop: 2,
    fadeOutDuration: 400,
  };

  var initial = Object.assign({}, defaults, options);
  var current = Object.assign({}, initial);
  var visible = false;
  var renderedParams = {};

  /**
   * (Internal) Generate html to render progress bar
   * @returns {string}
   */
  function template(percent, height, color, style, paddingTop){
    var paddingTopHtml = paddingTop == null ? '' : `padding-top: ${paddingTop}px;`;

    return `<div style="position: relative;">` +
      `  <div style="position: absolute; width: 100%; ${paddingTopHtml}">` +
      `    <div style="height: ${height}px; background-color: ${color}; ` +
           `position: absolute; width: ${percent.toFixed(0)}%; box-shadow: ${style};` +
           `transition: width 0.4s ease 0s; z-index: 10000;"` +
      `    </div>` +
      `  </div>` +
      `</div>`;
  }

  /**
   * (Internal) Check if the progress bar elements have been added to DOM.
   * @returns {bool} True if created
   */
  function isRendered(){
    return $('#xhr-progress > div > div > div').length === 1;
  }

  /**
   * (Internal) Update the progress bar.
   * @param {bool} Tru if OK, false if failed condition [default: true]
   * @returns {void}
   */
   function render(isOk){
    if (visible){
      if (isOk !== false){
        renderProgressBar(current.percent, current.height, current.color, current.style, current.paddingTop);
      }
      else{
        renderProgressBar(current.percent, current.height, current.colorFailed, current.styleFailed, current.paddingTop);
      }
    }
    else{
      $(current.parent).html("");
    }

    function renderProgressBar(percent, height, color, style, paddingTop){
      var paramsChanged = false;

      if (height !== renderedParams.height ||
        color !== renderedParams.color ||
        style !== renderedParams.style){
        paramsChanged = true;
        renderedParams = {height, color, style};
      }

      var test = false;

      if (!isRendered() || paramsChanged || test){
        $(current.parent).html(template(percent, height, color, style, paddingTop));
      }
      else{
        $(current.parent).find('div>div>div').width(`${current.percent.toFixed(0)}%`);
      }
    }
   }

  /**
   * (Internal) Compress value so that returned value never exceeds 100:
   *  x = 100 yields 68%; Inf yields 100%.
   *
   * @param {number} Value 0-Inf
   * @returns {number} Value 0...100
   */
  function compress(x){
    return 100*(1-1/Math.pow(10,x/200));
  }

  /**
   * Shows the progress bar (as soon as delay has elapsed).
   *
   * @param {bool} If true, assume progress is made without calling
   *               trickle()/increment()/set() [not implemented]
   * @param {number} If auto, specify expected duration until complete in
   *               ms[default: 5000] [not implemented]
   * @returns {void}
   */
  function start(auto, duration){
    visible = true;

    if (auto === true){
      current.percent = 15;

      if (duration == null){
        duration = 5000;
      }
    }
    else{
      current.percent = 0;
    }

    current.auto = auto === true;
    render();
  }

  /**
   * Incremental progress (random) will never reach 100%.
   *
   * @returns {void}
   */
  function trickle(){
    current.percent += 5 + Math.random() * 10;
    render();
  }

  /**
   * Incremental progress (sum of deltas <= 100).
   *
   * @returns {void}
   */
  function increment(delta){
    current.percent += delta;
    current.percent = Math.min(current.percent, 100);
    render();
  }

  /**
   * Incremental progress (sum of deltas <= 100).
   *
   * @returns {void}
   */
  function set(percent){
    current.percent = Math.min(percent, 100);
    render();
  }

  /**
   * Get current value of progress bar (percent).
   *
   * @returns {number}
   */
  function get(){
    return current.percent;
  }

  /**
   * Indicate a failed request (bar canges to colorFailed then disappears).
   *
   * @returns {void}
   */
  function fail(fnFailed){
    var final = JSON.parse(JSON.stringify(current));
    debugger;
    render(false);

    $(current.parent).children().first().delay(700).fadeOut(current.fadeOutDuration, function(){
      visible = false;
      render();

      if (typeof func === "function"){
        func(final);
      }
    });
  }

  /**
   * Sets the progress to 100% then fades out.
   * @param {function} Complete function. Final state object passed in as parameter.
   * @returns {void}
   */
  function complete(fnComplete){
    current.percent = 100;
    var final = JSON.parse(JSON.stringify(current));
    render();

    $(current.parent).children().first().fadeOut(current.fadeOutDuration, function(){
      visible = false;
      render();

      if (typeof func === "function"){
        func(final);
      }
    });
  }

  function visible(){
    return visible;
  }

  return {start, trickle, increment, set, get, fail, complete, visible};
});
