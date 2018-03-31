# xhr-progress.js
A minimalist progress bar for XHR/AJAX requests that uses same styling as GitHub progress bar.

# Demo
This [demo](https://kashiraja.github.io/xhr-progress/examples/admin_dashboard.html) shows how it is possible to use xhr-progress.js in a panel as part of an admin dashboard.

# Options
*   parent: Parent element
*   height: Height [px]
*   color: Color of progress bar
*   colorFailed: Color of progress bar if `failed()`
*   style: Box shadow style of bar
*   styleFailed: Box shadow style of bar
*   paddingTop: Add some whitespace above the progress bar [px]
*   fadeOutDuration: Once complete, fade out the progress bar during given interval [ms]

# Acknowledgments
- GitHub
- [NProgress](https://github.com/rstacruz/nprogress) - Originally intended to use this project, but ended up creating my own in order to allow progress bar to be inserted into a panel. Most popular progress bar on GitHub!
