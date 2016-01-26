<div class="styleguide__title-1">Grid</div>
<p class="styleguide__summary">This 12-column, responsive grid provides structure for website content.</p>

<div class="styleguide__title-2 styleguide__text--blue">Grid</div>
<div class="styleguide__title-4">Grid for large viewport</div>
<section class="styleguide__box styleguide__box--preview styleguide__grid-example">
    {{ load(file='partials/grid-col.html.twig') }}
</section>
<div class="styleguide__accordion" data-component="Application/Components/StyleguideAccordion">
    <header class="styleguide__accordion__header">
        Code
    </header>
    <div class="styleguide__accordion__content">
        <pre class="styleguide__code" data-component="Application/Components/Code"><div class="styleguide__button styleguide__button--copy tooltip" data-clipboard-target="#<?=$cur;?>"><img src="assets/default/images/svg/clippy.svg" alt="Copy to clipboard"></div><code id="<?=$cur;?>"><?=printPartial('components/partials/grid/col');?></code></pre>
    </div>
</div>
<br>

<div class="styleguide__title-4">Grid with equal cols</div>
<section class="styleguide__box styleguide__box--preview styleguide__grid-example">
    <?=partial('grid/equal-cols');?>
    {{ load(file='partials/grid-equal-cols.html.twig') }}
</section>
<div class="styleguide__accordion" data-component="Application/Components/StyleguideAccordion">
    <header class="styleguide__accordion__header">
        Code
    </header>
    <div class="styleguide__accordion__content">
        <pre class="styleguide__code" data-component="Application/Components/Code"><div class="styleguide__button styleguide__button--copy tooltip" data-clipboard-target="#<?=$cur;?>"><img src="assets/default/images/svg/clippy.svg" alt="Copy to clipboard"></div><code id="<?=$cur;?>"><?=printPartial('components/partials/grid/equal-cols');?></code></pre>
    </div>
</div>
<br>

<div class="styleguide__title-4">Grid offsets</div>
<section class="styleguide__box styleguide__box--preview styleguide__grid-example">
    <?=partial('grid/offset');?>
    {{ load(file='partials/grid-offset.html.twig') }}
</section>
<div class="styleguide__accordion" data-component="Application/Components/StyleguideAccordion">
    <header class="styleguide__accordion__header">
        Code
    </header>
    <div class="styleguide__accordion__content">
        <pre class="styleguide__code" data-component="Application/Components/Code"><div class="styleguide__button styleguide__button--copy tooltip" data-clipboard-target="#<?=$cur;?>"><img src="assets/default/images/svg/clippy.svg" alt="Copy to clipboard"></div><code id="<?=$cur;?>"><?=printPartial('components/partials/grid/equal-cols');?></code></pre>
    </div>
</div>
<br>