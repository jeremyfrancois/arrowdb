$(document).ready(function(){
    let $table = $('.table');
    $table.bootstrapTable();

    load();

    function load(){
        (async () => {
            const fetchBrands = await fetch(`resources/brands.json`);
            const brands = await fetchBrands.json();

            brands.sort();

            brands.forEach(brand => {
                (async () => {
                    $('#brand').append(new Option(brand.label, brand.label.charAt(0).toUpperCase() + brand.label.slice(1)));
                    const fetchModels = await fetch(`resources/brands/${brand.code}.json`);
                    const data = await fetchModels.json();
                    data.forEach(model => populate(model));
                })();
            });

            $('select').select2();
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
    let html = '';
    if(Array.isArray(value)){
        value.forEach(val => { html += straightnessPillBadge(Number(val)) + '&nbsp;'});
    } else {
        html = straightnessPillBadge(Number(value));
    }
    return html;
}

function straightnessPillBadge(value){
    if(value <= 0.0015){
        return `<span class="badge rounded-pill bg-warning">${value}</span>`;
    } else if(value > 0.0015 && value <= 0.0035){
        return `<span class="badge rounded-pill bg-success">${value}</span>`;
    }
    return `<span class="badge rounded-pill bg-danger">${value}</span>`;
}

function weightToleranceFormatter(value){
    return value ? '+/-'+value+'gr.' : 'n/a';
}

function linkFormatter(value){
    return value ? '<a href="'+value+'" target="_blank"><i class="fas fa-external-link-alt"></i></a>' : '';
}

function categoryFormatter(value){
    let values = value.split('/');
    let html = '';
    values.forEach(val => {
        switch(val.trim()){
            case 'target':
                html += '<i class="fas fa-bullseye"></i>&nbsp;';
                break;
            case 'hunting':
                html += '<i class="fas fa-tree"></i>&nbsp;';
                break;
            case 'traditional':
                html += '<i class="fas fa-feather-alt"></i>&nbsp;';
                break;
        }
    });
    return html;
}

function colorFormatter(value){
    let values = value.split('/');
    let html = '';
    values.forEach(val => {
        switch(val.trim()){
            case 'wood':
                html += '<img src="img/wood.jfif" height="15px" width="15px">';
                break;
            case 'black':
            case 'black carbon':
                html += '<img src="img/black carbon.jfif" height="15px" width="15px">';
                break;
            case 'black carbon weave':
                html += '<img src="img/black carbon weave.jfif" height="15px" width="15px">';
                break;
            case 'traditional':
                html += '<img src="img/black carbon weave.jfif" height="15px" width="15px">';
                break;
            default : 
                break;
        }
    });
    return html;
}