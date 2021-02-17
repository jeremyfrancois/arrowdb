$(document).ready(function(){
    let $table = $('.table');
    let data = [];
    let filter_ = {};
    $table.bootstrapTable();

    load();
    
    $('#gpi').on('slideStop', onChangeGPIRange);
    $('#outer_diameter').on('slideStop', onChangeODRange);
    $('#inner_diameter').on('slideStop', onChangeIDRange);
    $('#straightness').on('slideStop', onChangeStraightnessRange);
    $('#model').on('input', onChangeModel);
    $('#brand').on('change', onChangeBrand);
    $('#category').on('change', onChangeCategory);

    $table.bootstrapTable('refreshOptions', {
        filterOptions: {
          filterAlgorithm: filter
        }
    });

    function load(){
        (async () => {
            const fetchBrands = await fetch(`resources/brands.json`);
            const brands = await fetchBrands.json();

            brands.sort();

            brands.forEach(brand => {
                (async () => {
                    $('#brand').append(new Option(brand.label, brand.label.charAt(0).toUpperCase() + brand.label.slice(1), true, true));
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
        Array.prototype.push.apply(data, arrows);
    }

    function onChangeGPIRange(){
        $.extend(filter_,{"gpi" : $(this).val()});
        $table.bootstrapTable('filterBy',filter_);
    }

    function onChangeODRange(){
        $.extend(filter_,{"outer_diameter" : $(this).val()});
        $table.bootstrapTable('filterBy',filter_);
    }

    function onChangeIDRange(){
        $.extend(filter_,{"inner_diameter" : $(this).val()});
        $table.bootstrapTable('filterBy',filter_);
    }

    function onChangeStraightnessRange(){
        $.extend(filter_,{"straightness" : $(this).val()});
        $table.bootstrapTable('filterBy',filter_);
    }

    function onChangeModel(){
        $.extend(filter_,{"model" : $(this).val()});
        $table.bootstrapTable('filterBy',filter_);
    }

    function onChangeBrand(){
        $.extend(filter_,{"brands" : $(this).select2('data')});
        $table.bootstrapTable('filterBy',filter_);
    }

    function onChangeCategory(){
        $.extend(filter_,{"categories" : $(this).select2('data')});
        $table.bootstrapTable('filterBy',filter_);
    }

    function filter(arrow,filters){
            let ok = true;
            if(filters.gpi && filters.gpi.length > 0){
                let gpi = filters.gpi.split(',');
                let gpi_min = Number(gpi[0]);
                let gpi_max = Number(gpi[1]);
                if(arrow.weight < gpi_min || arrow.weight > gpi_max)
                ok = false;
            }

            if(filters.straightness && filters.straightness.length > 0){
                let straightness = filters.straightness.split(',');
                let straightness_min = Number(straightness[0]);
                let straightness_max = Number(straightness[1]);
                if(arrow.straightness < straightness_min || arrow.straightness > straightness_max)
                ok = false;
            }

            if(filters.outer_diameter && filters.outer_diameter.length > 0){
                let outer_diameter = filters.outer_diameter.split(',');
                let outer_diameter_min = Number(outer_diameter[0]);
                let outer_diameter_max = Number(outer_diameter[1]);
                if(arrow.outer_diameter < outer_diameter_min || arrow.outer_diameter > outer_diameter_max)
                ok = false;
            }

            if(filters.inner_diameter && filters.inner_diameter.length > 0){
                let inner_diameter = filters.inner_diameter.split(',');
                let inner_diameter_min = Number(inner_diameter[0]);
                let inner_diameter_max = Number(inner_diameter[1]);
                if(arrow.inner_diameter < inner_diameter_min || arrow.inner_diameter > inner_diameter_max)
                ok = false;
            }

            if(filters.brands && filters.brands.length > 0 && !$.inArray(arrow.brand,filters.brands)){
                ok = false;
            }

            if(filters.categories && filters.categories.length > 0 && !$.inArray(arrow.category,filters.categories)){
                ok = false;
            }
            
            if(!arrow.model.includes(filters.model)){
                ok = false;
            }
    
            return ok;
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