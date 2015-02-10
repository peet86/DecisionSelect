// DecisionSelect: jquery plugin to display an HTML question-answer tree as a flat decision-select list
// version 1.0
// (c) 2015 Peter Varga [info@vargapeter.com]
// released under the Apache 2.0 license

(function($){
    $.decisionSelect = function(el, options){
        var base = this;
        
        base.$el = $(el);
        base.el = el;
        
        base.$el.data("decisionSelect", base);
        
        base.init = function(){
            base.options = $.extend({},$.decisionSelect.defaultOptions, options);
            
            if(base.options.tree.length>0){
              // generate selects
              	base.generate(base.options.tree,base.$el,0,"/");
            }else{
              //exit
              if(base.options.debug) $.error("Missing 'tree' object.");
              return; 
            }
		
            // hide all sub question + answers
            $(".qac:not(:first)").hide();
          
            if(base.options.remove) base.options.tree.remove();
        };
      
                
        base.generate = function($subtree,$container,i,p){
          i++;

          // subtree items
            $subtree.children(base.options.container).each(function(j){
              var $li=$(this);
              var $a = $li.children(base.options.containerIn);
              var $sub = $li.children(base.options.containerSub);                    				

              var ac= $a.html();
              var al= $a.attr(base.options.attrLink);


              if(i%2){
                //question
                if($sub.length>0){
                  var $qac=$("<div class='qac' data-link='"+p+"'></div>");
                  var $qaq=$("<a class='qaq'>"+ac+"</a>");
                  var $qas=$("<select class='qas'></select>");
                  var $selectplease=$("<option class='qaa' selected='selected' value=''>"+base.options.please+"</option>");
                  base.$el.append($qac); //root
                  $qac.append($qaq);
                  $qac.append($qas);
                  $qas.append($selectplease);
                  $container=$qas;

                  $container.on("change",function(el){
                    var link=$(this).val();
                    
                     // hide and reset all qac after
                     $(this)
                       .parent()
                       .nextAll(".qac")
                       .hide()
                       .find('select option:eq(0)')
                       .prop('selected', true);

                     base.options.onAnswer.call(base,link);
                    
                     // display child qac 
                     if(link!=""){
                       var cqac=$('.qac[data-link="'+link+'"]');
                       if(cqac.length>0){
                         	cqac.show();
                       }else{
                         base.options.onFinalAnswer.call(base,link);
                       }
                     }

                  });

                  base.generate($sub,$container,i,p); 

                }else{
                  if(base.options.debug) $.error("Question without answer ("+ac+")");
                }

               }else{
                  //answer
                   $o=$("<option class='qaa' value='"+al+"'>"+ac+"</option>");
                  $container.append($o); 

                  // sub questions
                  if($sub.length>0) base.generate($sub,$container,i,al);        
               }

            });

        }
        
        base.init();
    };
    
    $.decisionSelect.defaultOptions = {
        debug: false,
        tree: "null",
        remove: true,
        please: "Pelase select..",
        attrLink:"href",
        container:"li",
        containerSub:"ul",
        containerIn:"a",
        onFinalAnswer:function(){},
        onAnswer:function(){}
    };
    
    $.fn.decisionSelect = function(options){
        return this.each(function(){
            (new $.decisionSelect(this, options));
        });
    };
    
})(jQuery);
