<?php

use Symfony\Component\HttpFoundation\Request;
use \Symfony\Component\HttpFoundation\Response;

ini_set('display_errors', 'On');

require_once __DIR__.'/../vendor/autoload.php';

$app = new Silex\Application();
$app['debug'] = true;
$app->register(new Silex\Provider\TwigServiceProvider(), array(
    'twig.path' => __DIR__ . '/../resources/views',
));
$app->match('/', function (Request $request) use ($app) {
    $path = realpath(__DIR__ . '/docs/' . $request->query->get('p'));

    if (!$path) {
        return new Response('Not found', Response::HTTP_NOT_FOUND);
    }

    return new Response($app['twig']->render(
        'iframe.html.twig',
        [
            'content' => file_get_contents($path),
        ]
    ));
});
$app->run();
