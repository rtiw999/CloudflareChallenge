const Router = require('./router')

import Link from './LinkObj'
import { LinksTransformer, ProfileHandler, ImageHandler, HeaderHandler, TitleHandler, SocialHandler, BackgroundHandler } from './ElementHandlers'

var links = new Array(new Link("Stadia", "https://stadia.google.com/home"), new Link("YouTube", "https://www.youtube.com/"), new Link("Google", "https://www.google.com/"));

const rewrite = new HTMLRewriter().on('div#links', new LinksTransformer(links)).on('div#profile', new ProfileHandler())
    .on('img#avatar', new ImageHandler()).on('h1#name', new HeaderHandler()).on('title', new TitleHandler())
    .on('div#social', new SocialHandler()).on('body', new BackgroundHandler());

/**
 * Example of how router can be used in an application
 *  */
addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

/* 
    Serves the /links route of the REST API
*/
function handleLinks() {
    const head = {
        headers: { 'content-type': 'application/json' },
    }
    console.log("Worked")
    const body = JSON.stringify(links)
    return new Response(body, head)
}

/*
    Uses HTMLRewriter to parse static html and return an edited page
*/
async function changeHTML() {
    const url = "http://static-links-page.signalnerve.workers.dev"
    const head = {
        headers: {'content-type': 'text/html' },
    }
    const res = await fetch(url, head)

    return rewrite.transform(res)
}

async function handleRequest(request) {
    const r = new Router()

    r.get('.*/links', () => handleLinks())
    r.get('.*/', () => changeHTML())

    const resp = await r.route(request)
    return resp
}
