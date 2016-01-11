<?php

use Inventis\WebStandards\Group;
use Inventis\WebStandards\Twig\Extension\FileInclude;
use Inventis\WebStandards\WebStandardsServiceProvider;
use Symfony\Component\HttpFoundation\Request;

ini_set('display_errors', 'On');

require_once __DIR__.'/../vendor/autoload.php';

$app = new Silex\Application();

$app['debug'] = true;

// Web Standards
$app->register(new WebStandardsServiceProvider());

FileInclude:: setBaseDir(__DIR__ . '/docs');
FileInclude:: setRenderer(new \Inventis\WebStandards\Renderers\DefaultRenderer());

// Routing
$app->match('/', function (Request $request) use ($app) {
    return $app['web-standards']
        ->addGroup(__DIR__ . '/docs/home', Group::VISIBILITY_HIDDEN)
        ->addGroup(__DIR__ . '/docs/standards')
        ->addGroup(__DIR__ . '/docs/pages', Group::VISIBILITY_DEV)
        ->addGroup(__DIR__ . '/docs/partials', Group::VISIBILITY_DEV)
        ->render($request->query->get('p', 'home/home.md'));
});

$app->run();
