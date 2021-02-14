$(document).ready(function(){
 $('.table').bootstrapTable();
 $('.table').bootstrapTable('showLoading');
 let arrows = [];
 $.get('resources/victory.json', load);

 function load(data){
  
  data.forEach(model => populate(model));
  $('.table').bootstrapTable('hideLoading');
  $('.table').bootstrapTable('load',arrows);
 }

 function populate(model){
  
  model.specs.forEach(function(spec){
   let arrow = {};
  $.extend(arrow,model,spec);
   arrows.push(arrow);
  });
 }
});
