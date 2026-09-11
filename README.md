# ctsp-external-documentation
External documentation for the Stø Token Service.

## MkDocs

The documentation is written in Markdown and is generated using MkDocs.
The documentation is found in the `docs` directory. The documentation is generated and published to GitHub Pages at [https://bankaxept.github.io/bankaxept-ctsp-external-documentation/](https://bankaxept.github.io/bankaxept-ctsp-external-documentation/).

Mkdocs installation instructions can be found [here](https://www.mkdocs.org/user-guide/installation/).

This documentation also depends on the Material for MkDocs theme and the Mermaid2 plugin. Install them with:

```bash
pip3 install mkdocs-material mkdocs-mermaid2-plugin
```

To host the MKDocs locally, run the following command in the root directory of the repository:

```bash
mkdocs build --strict
mkdocs serve
```

Note that depending on your configuration you might have to run Mkdocs in a Python virtual environment.
Often you would do this by running the following commands:

```bash
source ~/.python/bin/activate
```
