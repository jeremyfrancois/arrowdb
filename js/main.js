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
        const arrows = [];
        model.specs.forEach(spec => {
            let arrow = {};
            $.extend(arrow,model,spec);
            arrows.push(arrow);
        });
        $table.bootstrapTable('append', arrows);
    }
});

function straightnessFormatter(value){
    return value ? '+/-'+value+'"' : 'n/a';
}

function weightToleranceFormatter(value){
    return value ? '+/-'+value+'gr.' : 'n/a';
}

function linkFormatter(value){
    return value ? '<a href="'+value+'" target="_blank"><i class="fas fa-external-link-alt"></i></a>' : '';
}