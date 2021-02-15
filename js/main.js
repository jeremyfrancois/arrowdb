$(document).ready(function(){
    let $table = $('.table');
    $table.bootstrapTable();

    load();

    function load(){
        (async () => {
            const fetchBrands = await fetch(`resources/brands.json`);
            const brands = await fetchBrands.json();
            brands.forEach(brand => {
                (async () => {
                    const fetchModels = await fetch(`resources/brands/${brand}.json`);
                    const data = await fetchModels.json();
                    data.forEach(model => populate(model));
                })();
            });
        })();
    }

    function populate(model){
        model.specs.forEach(spec => {
            let arrow = {};
            $.extend(arrow,model,spec);
            $table.bootstrapTable('append', [arrow]);
        });
    }
});
