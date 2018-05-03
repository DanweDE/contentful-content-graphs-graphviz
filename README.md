This repository contains code accompanying my Contentful blog post _TBA_ about
generating directed graphs using [Graphviz] visualizing
a [Contentful] space's structured content (entries and assets).


## Working with the code
First, download this repository and install all dependencies:

```bash
git clone https://github.com/DanweDE/contentful-content-graphs-graphviz.git
cd contentful-content-graphs-graphviz
npm install
```

To better follow the blog post you can checkout the respective branch for each step,
e.g. `git checkout blog-post/step-3`.


### Exporting a Contentful space
To export a Contentful space of your choice to work with, run

```js
node ./util/export-space.js --file=space.json --space=CF_SPACE_ID --token=CF_CMA_TOKEN
```

or use the [Contentful export tool][contentful-export] cli directly.


### Generating dot (Graphviz) markup
With the _space.json_ created in this folder you can run:

```js
node ./src/index.js space.json
```

This takes the previous step's _space.json_ and prints the _dot_ markup for a graph.


### Drawing the graph

The generated dot markup can either be copy pasted to [viz-js.com](http://viz-js.com)
or it can be processed by a local [Graphviz installation][install Graphviz]:

```js
node ./src/index.js | dot -o graph.svg -T svg -K dot
```

Instead of `-K dot` any other Graphviz layout engine like `neato`, `fdp` or `circo`
can be used to influence the layout of the generated graph.


[Contentful]: https://contentful.com
[contentful-export]: https://github.com/DanweDE/contentful-content-graphs-graphviz.git
[Graphviz]: https://www.graphviz.org
[install Graphviz]: https://graphviz.gitlab.io/download
