<?php

use Inventis\WebStandards\NodeRouter;
use Inventis\WebStandards\Twig\Extension\FileInclude;
use Inventis\WebStandards\WebStandardsServiceProvider;
use Symfony\Component\HttpFoundation\Request;

ini_set('display_errors', 'On');

require_once __DIR__.'/../vendor/autoload.php';

$app = new Silex\Application();

$app['debug'] = true;

// Web Standards
$app->register(new WebStandardsServiceProvider(__DIR__ . '/../resources/views/'));

// Routing
$app->match('/', function (Request $request) use ($app) {
    $app['web-standards']
        ->addPath(__DIR__ . '/docs/home', NodeRouter::VISIBILITY_HIDDEN)
        ->addPath(__DIR__ . '/docs/standards', NodeRouter::VISIBILITY_DEV)
        ->addPath(__DIR__ . '/docs/pages'/*, NodeRouter::VISIBILITY_DEV*/)
        ->addPath(__DIR__ . '/docs/examples'/*, NodeRouter::VISIBILITY_DEV*/)
        ->addPath(__DIR__ . '/docs/partials'/*, NodeRouter::VISIBILITY_DEV*/)
        ->addPath(__DIR__ . '/docs/checklists'/*, NodeRouter::VISIBILITY_DEV*/);

    $page = $request->query->get('p', 'home/home.md');
    if ($request->query->getBoolean('iframe', false) == true) {
        return $app['web-standards']->renderIframeContent($page);
    } else {
        return $app['web-standards']->renderPage($page);
    }
});

$app->run();
