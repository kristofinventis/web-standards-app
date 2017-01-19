Web Standards: << My Project >>
===

###Logo:
<div class="boxed">
{{ load(file='partials/logo.html.twig', showCode=false, wrapInIframe=true) }}
</div>

###Typography Styles:
<div class="boxed">
{{ load(file='partials/typography-styles.html.twig', showCode=false, wrapInIframe=true) }}
</div>

###Button Styles:
<div class="boxed">
{{ load(file='examples/buttons.html.twig', showCode=false, wrapInIframe=true) }}
</div>

###Typography Example:
<div class="boxed">
{{ load(file='examples/typography-example.html.twig', showCode=false, wrapInIframe=true) }}
</div>

###Colors:
<div class="boxed">
{{ colorList('../styles/sass--default/variables.scss') }}
</div>

###Icons:
<div class="boxed">
{{ svgList('assets/default/images/svg/') }}
</div>