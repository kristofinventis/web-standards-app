<div class="title-1">Grid</div>
<p class="summary">This 12-column, responsive grid provides structure for website content.</p>

<div class="title-2 styleguide__text--blue">Grid</div>
<div class="title-4">Grid for large viewport</div>
<section class="box box--preview grid-example">
    {{ load(file='partials/grid-col.html.twig', showCode=true) }}
</section>
<!-- <div class="accordion" data-component="Application/Components/StyleguideAccordion">
    <header class="accordion__header">
        Code
    </header>
    <div class="accordion__content">
        <pre class="code" data-component="Application/Components/Code"><div class="button button--copy tooltip" data-clipboard-target="#<?=$cur;?>"><img src="assets/default/images/svg/clippy.svg" alt="Copy to clipboard"></div><code id="<?=$cur;?>"><?=printPartial('components/partials/grid/col');?></code></pre>
    </div>
</div> -->
<br>

<div class="title-4">Grid with equal cols</div>
<section class="box box--preview grid-example">
    <?=partial('grid/equal-cols');?>
    {{ load(file='partials/grid-equal-cols.html.twig', showCode=true) }}
</section>
<!-- <div class="accordion" data-component="Application/Components/StyleguideAccordion">
    <header class="accordion__header">
        Code
    </header>
    <div class="accordion__content">
        <pre class="code" data-component="Application/Components/Code"><div class="button button--copy tooltip" data-clipboard-target="#<?=$cur;?>"><img src="assets/default/images/svg/clippy.svg" alt="Copy to clipboard"></div><code id="<?=$cur;?>"><?=printPartial('components/partials/grid/equal-cols');?></code></pre>
    </div>
</div> -->
<br>

<div class="title-4">Grid offsets</div>
<section class="box box--preview grid-example">
    <?=partial('grid/offset');?>
    {{ load(file='partials/grid-offset.html.twig', showCode=true) }}
</section>
<!-- <div class="accordion" data-component="Application/Components/StyleguideAccordion">
    <header class="accordion__header">
        Code
    </header>
    <div class="accordion__content">
        <pre class="code" data-component="Application/Components/Code"><div class="button button--copy tooltip" data-clipboard-target="#<?=$cur;?>"><img src="assets/default/images/svg/clippy.svg" alt="Copy to clipboard"></div><code id="<?=$cur;?>"><?=printPartial('components/partials/grid/equal-cols');?></code></pre>
    </div>
</div> -->
<br>