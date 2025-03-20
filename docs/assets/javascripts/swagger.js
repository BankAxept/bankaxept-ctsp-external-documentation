const swaggerUrls = {
    "swagger-ctsp-token-api": {
        name: "BankAxept CTSP integrator API",
        // replace the url with the raw one when the API is public
        url: "https://raw.githubusercontent.com/BankAxept/bankaxept-ctsp-external-documentation/refs/heads/main/openapi/ctsp-web-service-interface/ctsp-token-api.yaml"
    }
}

const loadSwaggerUIBundle = function (id, url) {
    window.ui = SwaggerUIBundle({
        url: url.url,
        dom_id: "#" + id,
        presets: [
            SwaggerUIBundle.presets.apis,
            SwaggerUIBundle.SwaggerUIStandalonePreset
        ]
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const loadAllSwaggerUIBundles = function () {
        Object.keys(swaggerUrls).forEach(id => {
            const swaggerElement = document.getElementById(id);
            if (swaggerElement !== null && !swaggerElement.hasChildNodes()) {
                loadSwaggerUIBundle(id, swaggerUrls[id]);
            }
        });
    };

    // Initial load
    loadAllSwaggerUIBundles();

    // Observe for future changes
    const observer = new MutationObserver(function (mutationsList, observer) {
        loadAllSwaggerUIBundles();
    });

    const targetNode = document.body;
    const config = {childList: true, subtree: true};
    observer.observe(targetNode, config);
});
