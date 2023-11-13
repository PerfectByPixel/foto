$(document).ready(function() {
    $(document).on('click', '.submit', function() {
        var error       = false,
            captchaFlag = false,
            _this       = $( this ),
            formObj     = _this.parents( 'form' ),
            emailFormat = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
            telFormat   = /[0-9 -()+]+$/,
            actionURL   = formObj.attr( 'action' ),
            resultsObj  = formObj.find( '.form-results' ),
            grecaptchav3= _this.attr( 'data-sitekey' ) || '',
            redirectVal = formObj.find( '[name="redirect"]' ).val();
        formObj.find( '.required' ).removeClass( 'error' );
        formObj.find( '.required' ).each( function() {
            var __this   = $( this ),
                fieldVal= __this.val();
            if( fieldVal == '' || fieldVal == undefined ) {
                error = true;
                __this.addClass( 'error' );
            } else if( __this.attr( 'type' ) == 'email' && ! emailFormat.test( fieldVal ) ) { 
                error = true;
                __this.addClass( 'error' );
            } else if( __this.attr( 'type' ) == 'tel' && ! telFormat.test( fieldVal ) ) { 
                error = true;
                __this.addClass( 'error' );
            }
        });
        var termsObj = formObj.find( '.terms-condition' );
        if ( termsObj.length > 0 ) {
            if ( ! termsObj.is( ':checked' ) ) {
                error = true;
                termsObj.addClass( 'error' );
            }
        }
        // Google reCaptcha Verify
        if ( typeof ( grecaptcha ) !== 'undefined' && grecaptcha !== null ) {
            if( formObj.find( '.g-recaptcha' ).length > 0 ) { // For Version 2
                var gResponse = grecaptcha.getResponse();
                if ( ! ( gResponse.length ) ) {
                    error = true;
                    formObj.find( '.g-recaptcha' ).addClass( 'error' );
                }
            } else if( grecaptchav3 != '' && grecaptchav3 != undefined ) { // For Version 3
                captchaFlag = true;
                formObj.find( 'input[name=action],input[name=g-recaptcha-response]' ).remove();
                grecaptcha.ready(function() {
                    grecaptcha.execute( grecaptchav3, { action: 'subscribe_newsletter' } ).then( function( token ) {
                        formObj.prepend('<input type="hidden" name="g-recaptcha-response" value="' + token + '">');
                        formObj.prepend('<input type="hidden" name="action" value="subscribe_newsletter">');

                        if( ! error ) {
                            submitAJAXForm( _this );
                        }
                    });
                });
            }
        }
        if( ! error && ! captchaFlag ) { // Check no errors && no google reCaptcha V3
            submitAJAXForm( _this );
        }
        return false;
    });

    $(document).on('blur', '.required', function() {
        var emailFormat = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
        telFormat   = /[0-9 -()+]+$/,
        fieldVal    = $( this ).val();
        if( fieldVal == '' || fieldVal == undefined ) {
            $( this ).addClass( 'error' );
        } else if( $( this ).attr( 'type' ) == 'email' && ! emailFormat.test( fieldVal ) ) {
            $( this ).addClass( 'error' );
        } else if( $( this ).attr( 'type' ) == 'tel' && ! telFormat.test( fieldVal ) ) {
            $( this ).addClass( 'error' );
        } else {
            $( this ).removeClass( 'error' );
        }
    });

    $(document).on('click', '.terms-condition', function() {
        var termsObj =  $( this );
        if ( ! termsObj.is( ':checked' ) ) {
            termsObj.addClass( 'error' );
        } else {
            termsObj.removeClass( 'error' );
        }
    });
});