$(document).ready(function(){
    let $table = $('.table');
    let data = [];
    let filter_ = {};
    $table.bootstrapTable();

    load();
    
    $('#spine, #gpi, #outer_diameter, #inner_diameter, #straightness').on('slideStop', onChangeFilter);
    $('#model').on('input', onChangeFilter);
    $('#brand, #category').on('change', onChangeFilter);

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
            let loadedBrands = [];
            brands.forEach(brand => {
                (async () => {
                    $('#brand').append(new Option(brand.label, brand.label.charAt(0).toUpperCase() + brand.label.slice(1), true, true));
                    const fetchModels = await fetch(`resources/brands/${brand.code}.json`);
                    const data = await fetchModels.json();
                    data.forEach(model => populate(model));
                    loadedBrands.push(brand);

                    if(loadedBrands.length === brands.length){
                        $('#loading').hide();
                        $('#main').fadeIn();
                    }
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

    function onChangeFilter(){
        let newFilter = {};
        newFilter[$(this).attr('name')] = $(this).val();
        $.extend(filter_,newFilter);
        $table.bootstrapTable('filterBy',filter_);
    }

    function filter(arrow,filters){
        let ok = true;
        if(filters){
            if(filters.spine && filters.spine.length > 0){
                let spine = filters.spine.split(',');
                let spine_min = Number(spine[0]);
                let spine_max = Number(spine[1]);
                if(arrow.spine < spine_min || arrow.spine > spine_max){
                    ok = false;
                } 
            }

            if(filters.gpi && filters.gpi.length > 0){
                let gpi = filters.gpi.split(',');
                let gpi_min = Number(gpi[0]);
                let gpi_max = Number(gpi[1]);
                if(arrow.weight < gpi_min || arrow.weight > gpi_max){
                    ok = false;
                } 
            }

            if(filters.straightness && filters.straightness.length > 0){
                let straightness = filters.straightness.split(',');
                let straightness_min = Number(straightness[0]);
                let straightness_max = Number(straightness[1]);
                if(arrow.straightness < straightness_min || arrow.straightness > straightness_max){
                    ok = false;
                }
            }

            if(filters.outer_diameter && filters.outer_diameter.length > 0){
                let outer_diameter = filters.outer_diameter.split(',');
                let outer_diameter_min = Number(outer_diameter[0]);
                let outer_diameter_max = Number(outer_diameter[1]);
                if(arrow.outer_diameter < outer_diameter_min || arrow.outer_diameter > outer_diameter_max){
                    ok = false;
                }
            }

            if(filters.inner_diameter && filters.inner_diameter.length > 0){
                let inner_diameter = filters.inner_diameter.split(',');
                let inner_diameter_min = Number(inner_diameter[0]);
                let inner_diameter_max = Number(inner_diameter[1]);
                if(arrow.inner_diameter < inner_diameter_min || arrow.inner_diameter > inner_diameter_max){
                    ok = false;
                }
            }

            if(filters.brands && filters.brands.length > 0 && $.inArray(arrow.brand,filters.brands) < 0){
                ok = false;
            }

            if(filters.categories && filters.categories.length > 0 && $.inArray(arrow.category,filters.categories) < 0){
                ok = false;
            }
            
            if(filters.model && filters.model.length > 0 && !arrow.model.toUpperCase().includes(filters.model.toUpperCase())){
                ok = false;
            }
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
            case 'black':
            case 'black carbon':
                html += '<img src="img/black carbon.jfif" height="15px" width="15px">';
                break;
            default : 
                html += `<img src="img/${val.trim()}.jfif" height="15px" width="15px">`;
                break;
        }
    });
    return html;
}