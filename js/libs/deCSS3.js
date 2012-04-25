var deCSS3 = {

  init: function ( addedStyles ) {

    this.addedStyles = addedStyles;
    this.toggleModernizr();
    
    var appendStyle = document.createElement( 'style' );
    
    if ( ! addedStyles || ! addedStyles.length ) {
      this.overrideRules();
      appendStyle.className = 'deCSS3-Style';
      appendStyle.textContent = this.addStyleBlock();
      document.body.appendChild( appendStyle );
    }
    else {
      // Remove the injected ones
      [].forEach.call( addedStyles, function( elem ) {
        elem.parentNode.removeChild( elem );
      });
      // Inject the old versions back in and delete the placeholders
      [].forEach.call( document.querySelectorAll( '.deCSS3-Placeholder' ), function ( elem ) {
        var appendStyle = document.createElement( 'style' );
        appendStyle.textContent = elem.innerHTML;
        elem.parentNode.insertBefore( appendStyle, elem );
        elem.parentNode.removeChild( elem );
      });
    }
  },


  addStyleBlock: function () {
    // TODO: background-clip, background-origin, background-size?, animation
    var that  = this,
        rules = [
      "animation-name:none",
      "box-shadow:none",
      "column-span:all",
      "text-shadow:none",
      "transform:none",
      "transition:none",
      "animation:none",
      "background-clip:border-box",
      "background-origin:0 0",
      "border-image:none"
    ];

    return '*, *:before, *:after {' + rules.map(function( v ){ return that.addPrefixes( v ); }).join( "" ) + '}';
  },

  addPrefixes: function ( rule ) {
    var prefixes = [ '-webkit-','-moz-','-o-', '-ms-', '-khtml-' ],
        postfix  = ' !important;';
    return prefixes.join( rule + postfix ) + rule + postfix + rule + postfix;
  },

  /**
   * TODO: write function that detects certain CSS3 rules and emptys out the rule to override
   * e.g., rgba(0,0,0,0.4) can be overriden by rgba()
   * 
   * @rules = multiplebg images, mediaqueries, background-size?, @font-face?
   */	

  overrideRules: function () {
    var ruleSets = {
          column : {
            regex    : /column-count(.*?)\;/g,
            sentinel : 'column-count',
            repl     : 'column-count: 1;'
          }
        },
        rFound   = /\@media|column-count/g,
        ruleReplacer = function ( found, newRule, sentinel, regex, repl ) {
          if ( found && ~ found.indexOf( sentinel ) ) {
            newRule = newRule.replace( regex, repl );
          }
          return newRule;
        };

    // Go through each stylesheet and return an array of new rules for each, then convert to string
    [].forEach.call( document.styleSheets, function ( stylesheet ) {
      var newRules = "",
          oldRules = "",
          stylePlaceholder = document.createElement( 'div' ),
          appendStyle = document.createElement( 'style' );

      // Bail if there are no styles
      if ( ! stylesheet.cssRules ) {
        return;
      }

      // Find the rules we want to delete
      [].forEach.call( stylesheet.cssRules, function ( rule, idx ) {
        var ruleText = rule.cssText,
            found    = ruleText.match( rFound ),
            i, ruleSet;

        oldRules += ruleText;
        newRule = ruleText;

        // Loop through each rule set and apply it to this css rule
        for ( i in ruleSets ) {
          ruleSet = ruleSets[ i ];
          newRule = ruleReplacer( found, newRule, ruleSet.sentinel, ruleSet.regex, ruleSet.repl );
        }

        // Add to rule list
        newRules += newRule;
      });

      // Create a placeholder element to hold the old rules
      stylePlaceholder.className = 'deCSS3-Placeholder';
      stylePlaceholder.style.display = 'none';
      stylePlaceholder.innerHTML = oldRules;

      // Create the modified styles
      appendStyle.className = 'deCSS3-Style';
      appendStyle.textContent = newRules;

      // Inject the new style
      stylesheet.ownerNode.parentNode.insertBefore( appendStyle, stylesheet.ownerNode );
      // Inject the placeholder style (to maintain order)
      stylesheet.ownerNode.parentNode.insertBefore( stylePlaceholder, stylesheet.ownerNode );
      // delete the old one
      stylesheet.ownerNode.parentNode.removeChild( stylesheet.ownerNode );

      // Just in case
      if ( stylesheet ) {
        stylesheet.disabled = true;
      }
    });
  },
  
  toggleModernizr: function(){
    if (!window.Modernizr) return;
    
    var newclasses = document.documentElement.className,
        clear = ( ! this.addedStyles || ! this.addedStyles.length ),
        bool, regex, match
    
    for (var feat in Modernizr){
      bool = Modernizr[feat];
      regex = RegExp('(?:^|\\s)(no-)?' + feat + '(?:\\s|$)');
      match = newclasses.match(regex);
      
      if (match){
        newclasses = newclasses.replace(regex, (( clear           ? ' no-' : 
                                                  Modernizr[feat] ? ' '    : 
                                                  ' no-')
                                                   + feat) + ' ');
      }
    }
    document.documentElement.className = newclasses;
  }
}
// Auto-init
//deCSS3.init( document.querySelectorAll( '.deCSS3-Style' ) );