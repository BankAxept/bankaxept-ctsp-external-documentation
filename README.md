# ctsp-external-documentation
External documentation for the Cloud Token Service Provider team.

## MkDocs

This repository is also used to generate the publicly hosted documentation for the DES API. The documentation is written in Markdown and is generated using
MkDocs.
The documentation is found in the `docs` directory. The documentation is generated and published to GitHub Pages at [https://desdoc.bankaxept.no](https://desdoc.bankaxept.no).

Mkdocs installation instructions can be found [here](https://www.mkdocs.org/user-guide/installation/).

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
