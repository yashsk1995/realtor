var basePrice = 0;
    var newPrice = 0;
    var newACPrice = 4000;
    var avgPrice= 0;
    var EppraisalPrice = 0;
    var zillowPrice = 0;
(function($){
    
    function initPageCalculator(){
  

    
        var per_bathroom_budgets = {
            '5' : {
                'Economy': 700,
                'Average': 800,
                'Luxury': 2500,
            },
            '10' : {
                'Economy': 1000,
                'Average': 1500,
                'Luxury': 8000,
            },
            '11' : {
                'Economy': 3000,
                'Average': 4000,
                'Luxury': 10000,
            }
        };
    
        var per_half_bathroom_budgets = {
            'Economy': 700,
            'Average': 700,
            'Luxury': 1500,
        }
        var per_half_bathroom_budgets2 = {
            'Economy': 700,
            'Average': 700,
            'Luxury': 1500,
        }
        var placesAutocomplete = places({
            appId: 'plRL22G93YJM',
            apiKey: '70064cc21162cb535ec3ec7f96bff3bb',
            container: document.querySelector('#full_address')
        });
    
        placesAutocomplete.on('change', function(e){
            console.log(e);
            var address = '';
            var full_address1 = e.query;
            var final_address = '';
            
            if(e.suggestion.hasOwnProperty('name')){
                address = e.suggestion.name;
                final_address =full_address1.split(e.suggestion.city)[0];
            }
            jQuery('#address').val(address);
        
            var citystate = '';
        
            if(e.suggestion.hasOwnProperty('city')){
                citystate = e.suggestion.city;
            }
    
            if(e.suggestion.hasOwnProperty('administrative')){
                if(citystate == ''){
                citystate = e.suggestion.administrative;
                }
                else{
                citystate = citystate + ',' + e.suggestion.administrative;
                }
            }
            jQuery('#citystate').val(citystate);
            console.log(final_address);
            console.log(citystate);
            searchZillowData(address, citystate);
            searchEppraisalData(final_address, citystate);
            

        })
    
        function searchZillowData(address, citystate){
            jQuery('body').addClass('loading');
            jQuery.ajax({
                url: '/api/get_zillow_deep_search',
                data:{
                address: address,
                citystate: citystate
                },
                type: 'post',
                dataType: 'json',
                success: function(res){
                    console.log(res)
                if(res.hasOwnProperty('SearchResults:searchresults') && res['SearchResults:searchresults'].hasOwnProperty('message')){
                    if(res['SearchResults:searchresults']['message'].code == "0"){
                    var result = res['SearchResults:searchresults']['response']['results']['result'];
        
                    if(result.length > 0){
                        result = result[0];
                    }
        
                    if(result.hasOwnProperty('lotsizeSqFt')){
                        $('#lotsizeSqFt').val(result['lotsizeSqFt']);
                    }
        
                    if(result.hasOwnProperty('finishedSqFt')){
                        $('#finishedSqFt').val(result['finishedSqFt']);
                    }
        
                    if(result.hasOwnProperty('bedrooms')){
                        $('#bedrooms').val(result['bedrooms']);
                    }
        
                    if(result.hasOwnProperty('Bedrooms')){
                        $('#bedrooms').val(result['Bedrooms']);
                    }
        
                    if(result.hasOwnProperty('bathrooms')){
                        $('#bathrooms').val(result['bathrooms']);
                    }
        
                    if(result.hasOwnProperty('Bathrooms')){
                        $('#bathrooms').val(result['Bathrooms']);
                    }
        
                    if(result.hasOwnProperty('yearBuilt')){
                        $('#yearBuilt').val(result['yearBuilt']);
                    }
                    
                    if(result.hasOwnProperty('zestimate')){
                        if(result['zestimate'].hasOwnProperty('amount')){
                            if(result['zestimate'].hasOwnProperty('amount')){
                                $('#basePrice').text(result['zestimate']['amount']['$t']);
                                basePrice = parseFloat($('#basePrice').text());
                                window.zillowPrice = basePrice;
                        }  
                        else if(result['zestimate'].hasOwnProperty('valuationRange')){
                        if(result['zestimate']['valuationRange'].hasOwnProperty('high')){
                            if(result['zestimate']['valuationRange'].hasOwnProperty('high')){
                                $('#basePrice').text(result['zestimate']['valuationRange']['high']['$t']);
                                basePrice = parseFloat($('#basePrice').text());
                                window.zillowPrice = basePrice;

                        }  
                        else if(result['zestimate']['valuationRange'].hasOwnProperty('low')){
                            $('#basePrice').text(result['zestimate']['valuationRange']['low']['$t']);
                            basePrice = parseFloat($('#basePrice').text());
                            window.zillowPrice = basePrice;

                        }  
                        }  
                    }
                    updatePrice();

                    }
                    else{
                    alert(res['SearchResults:searchresults']['message'].text);
                    $('#lotsizeSqFt').val('');
                    $('#finishedSqFt').val('');
                    $('#bedrooms').val('');
                    $('#bathrooms').val('');
                    $('#yearBuilt').val('');
                    $('#basePrice').val('0');
                    basePrice = 0;
                    }
                }
                else{
                    alert('Response Error');
                }
        
                jQuery('body').removeClass('loading');
                }
            }
            }
        }) }
        function searchEppraisalData(address, citystate){
            jQuery('body').addClass('loading');
            jQuery.ajax({
                url: '/api/get_Eppraisal_deep_search',
                data:{
                address: address,
                citystate: citystate
                },
                type: 'post',
                dataType: 'json',
                success: function(res){

                    // console.log(res);
                    EppraisalPrice = res[0].midValue;
                    // window.price2 = EppraisalPrice;
                    console.log(EppraisalPrice);
                    window.EppraisalPriceGL= EppraisalPrice;
                    // updatePrice2();
                    countAvg();

                }
            })

        }
        function countAvg(){
            
            var ZillowPrice = parseInt(window.zillowPrice);
            var EppraisalPrice= parseInt(window.EppraisalPriceGL);
            console.log("Zillow price : "+ZillowPrice);
            console.log("EppraisalPrice : "+EppraisalPrice);
            if(zillowPrice!= 0 && EppraisalPrice !=0){
                var avg = ((ZillowPrice+EppraisalPrice)/2);
                $('#basePrice').text(avg);
                window.AvgzillowEpp = avg;
        }
        else if(window.zillowPrice=0){
            var avg = window.window.EppraisalPriceGL;
            $('#basePrice').text(avg);
            window.AvgzillowEpp = avg;
        }
        else if(window.EppraisalPriceGL=0){
            var avg = window.zillowPrice;
            $('#basePrice').text(avg);
            window.AvgzillowEpp = avg;
        }
        else{

        }
        }
        
      
        function updatePrice(){

          
            newPrice = 0;

            // 4. What is the total Square footage of the property?
            var finishedSqFt = 0;
            if($('#finishedSqFt').val() != ''){
                finishedSqFt = parseFloat($('#finishedSqFt').val());
            }

            // 5. What is the total  living (under air) square footage ?
            var lotsizeSqFt = 0;
            if($('#lotsizeSqFt').val() != ''){
                lotsizeSqFt = parseFloat($('#lotsizeSqFt').val());
            }
        
            // 8. How many bathrooms?
            var bathrooms = 0;
            if($('#bathrooms').val() != ''){
                bathrooms = parseFloat($('#bathrooms').val());
            }
            console.log('bathrooms:', bathrooms);
        
            // 10. What year was the property built?
            var yearBuilt = 1960;
            if($('#yearBuilt').val() != ''){
                yearBuilt = parseInt($('#yearBuilt').val());
            }
            console.log('yearBuilt:', yearBuilt);

            // 12. Finishing Type?
            var finishing_type = $('#finishing_type').val();
            console.log('finishing_type:', finishing_type);

            if(finishedSqFt <= 1300){
                if(finishing_type == 'Economy'){
                    newPrice = newPrice + 6000;
                }
                else if(finishing_type == 'Average'){
                    newPrice = newPrice + 7500;
                }
                else if(finishing_type == 'Luxury'){
                    newPrice = newPrice + 12000;
                }
            }
            else if(finishedSqFt <= 2200){
                if(finishing_type == 'Economy'){
                    newPrice = newPrice + 8000;
                }
                else if(finishing_type == 'Average'){
                    newPrice = newPrice + 10000;
                }
                else if(finishing_type == 'Luxury'){
                    newPrice = newPrice + 18000;
                }
            }
            else if(finishedSqFt <= 4000){
                if(finishing_type == 'Economy'){
                    newPrice = newPrice + 12000;
                }
                else if(finishing_type == 'Average'){
                    newPrice = newPrice + 20000;
                }
                else if(finishing_type == 'Luxury'){
                    newPrice = newPrice + 30000;
                }
            }
            else if(finishedSqFt > 4500){
                newPrice = newPrice + 35000;
            }

            // 13. When was the bathrooms last updated?
            var bathroom_update_date = $('#bathroom_update_date').val();
            console.log('bathroom_update_date:', bathroom_update_date);

            newPrice = newPrice + per_bathroom_budgets[bathroom_update_date][finishing_type] * bathrooms;

            // 14. What is the age of your roof?
            var roof_age = $('#roof_age').val();
            console.log('roof_age:', roof_age);

            // 16. Does your roof have active leaks?
            var roof_has_leaks = $('#roof_has_leaks').val();
            console.log('roof_has_leaks:', roof_has_leaks);

            if(roof_has_leaks == 'Yes'){
                // if(roof_age == '9'){
                //     newPrice = newPrice + finishedSqFt * 2;
                // }
            }

            // 17. What Type of cooling?
            var cooling_type = $('#cooling_type').val();
            var cooling_age = $('#cooling_type').val();

            console.log('cooling_type:', cooling_type);
            console.log('cooling_age:', cooling_age);

            if(cooling_type == 'Central Air'){
                if(cooling_age == '3'){
                    newPrice = newPrice + 250;
                }
                else if(cooling_age == '5'){
                    newPrice = newPrice + 500;
                }
                else if(cooling_age == '8'){
                    newPrice = newPrice + 1000;
                }
                else {
                    if(finishedSqFt < 2000){
                        newPrice = newPrice + 3500;
                    }
                    else if(finishedSqFt >= 2000 && finishedSqFt < 3000){
                        newPrice = newPrice + 5000;
                    }
                    else if(finishedSqFt >= 3000 && finishedSqFt < 5000){
                        newPrice = newPrice + 8000;
                    }

                    newPrice = newPrice + (finishedSqFt / 1000) * 1500;
                }
            }
            else{
                newPrice = newPrice + finishedSqFt * 1.5;
                newPrice = newPrice + newACPrice;
            }

            // 18. What type of heating?
            var heating_type = $('#heating_type').val();
            var heating_age = $('#heating_age').val();
            console.log('heating_type:', heating_type);
            console.log('heating_age:', heating_age);

            if(heating_type == 'Furnace'){
                if(heating_age == '9'){
                    newPrice = newPrice + 3000;
                }

                newPrice = newPrice + 1500;
            }
            else if(heating_type == 'Central Heat'){
                if(heating_age == '5'){
                    newPrice = newPrice + 250;
                }
                else if(heating_age == '8'){
                    newPrice = newPrice + 1000;
                }

                newPrice = newPrice + 1500;
            }

            // 19. What is the age of the water heater? 
            var water_heater_age = $('#water_heater_age').val();
            console.log('water_heater_age:', water_heater_age);

            if(water_heater_age == '9'){
                if(finishedSqFt < 2000){
                    newPrice = newPrice + 1000
                }
                else if(finishedSqFt > 3000){
                    newPrice = newPrice + 1800
                }
                
            }

            // 21. When was the last time the flooring was updated?
            var last_update_flooring = $('#last_update_flooring').val();
            console.log('last_update_flooring:', last_update_flooring);

            if(last_update_flooring != '5'){
                if(finishing_type == 'Economy'){
                    newPrice = newPrice + finishedSqFt * 3;
                }
                else if(finishing_type == 'Average'){
                    newPrice = newPrice + finishedSqFt * 5;
                }
                else if(finishing_type == 'Luxury'){
                    newPrice = newPrice + finishedSqFt * 8;
                }
            }

            // 23. What is the condition of the electrical?
            var electrical_condition = $('#electrical_condition').val();
            console.log('electrical_condition:', electrical_condition);
            
            if(yearBuilt < 1970){
                if(electrical_condition == 'Minor'){
                    newPrice = newPrice + finishedSqFt * 4;
                }
                else if(electrical_condition == 'Moderate'){
                    newPrice = newPrice + finishedSqFt * 6;
                }
                else if(electrical_condition == 'Major'){
                    newPrice = newPrice + finishedSqFt * 9;
                }
            }
            else if(yearBuilt < 1987 && yearBuilt >= 1971){
                if(electrical_condition == 'Minor'){
                    newPrice = newPrice + finishedSqFt * 3;
                }
                else if(electrical_condition == 'Moderate'){
                    newPrice = newPrice + finishedSqFt * 5;
                }
                else if(electrical_condition == 'Major'){
                    newPrice = newPrice + finishedSqFt * 9;
                }
            } 
            else if(yearBuilt < 2000 && yearBuilt >= 1988){
                if(electrical_condition == 'Minor'){
                    newPrice = newPrice + finishedSqFt * 2;
                }
                else if(electrical_condition == 'Moderate'){
                    newPrice = newPrice + finishedSqFt * 4;
                }
                else if(electrical_condition == 'Major'){
                    newPrice = newPrice + finishedSqFt * 5;
                }
            } 
            else {
                if(electrical_condition == 'Minor'){
                    newPrice = newPrice + 1500;
                }
                else if(electrical_condition == 'Moderate'){
                    newPrice = newPrice + 5000;
                }
                else if(electrical_condition == 'Major'){
                    newPrice = newPrice + 10000;
                }
            }

            // 24. Have you noticed any foundation issues?
            var foundation = $('#foundation').val();
            console.log('foundation:', foundation);

            if(foundation == 'Minor'){
                newPrice = newPrice + 5000;
            }
            else if(foundation == 'Moderate'){
                newPrice = newPrice + 20000;
            }
            else if(foundation == 'Major'){
                newPrice = newPrice + 35000;
            }


            // 26. What is the condition of the pool?
            var pool_condition = $('#pool_condition').val();
            console.log('pool_condition:', pool_condition);
            
            if(pool_condition == 'Clear'){
                newPrice = newPrice + 1000;
            }
            else if(pool_condition == 'Green'){
                newPrice = newPrice + 5000;
            }


            // 28. Paint
            if ($("#paint_interior").is(":checked")) { 
                newPrice = newPrice + finishedSqFt * 1.5;
            }
            if ($("#paint_exterior").is(":checked")) { 
                newPrice = newPrice + finishedSqFt * 1.5;
            }

            // 29. Garage Doors
            if ($("#garage_doors1").is(":checked")) { 
                newPrice = newPrice + 1500;
            }
            if ($("#garage_doors2").is(":checked")) { 
                newPrice = newPrice + 2500;
            }

            // 30. Kitchen Appliances
            if ($("#kitchen_appliance_fridge").is(":checked")) { 
                newPrice = newPrice + 1500;
            }
            if ($("#kitchen_appliance_dishwasher").is(":checked")) { 
                newPrice = newPrice + 500;
            }
            if ($("#kitchen_appliance_microwave").is(":checked")) { 
                newPrice = newPrice + 300;
            }
            if ($("#kitchen_appliance_stove").is(":checked")) { 
                newPrice = newPrice + 600;
            }
            if ($("#kitchen_appliance_washing").is(":checked")) { 
                newPrice = newPrice + 800;
            }
            if ($("#kitchen_appliance_dryer").is(":checked")) { 
                newPrice = newPrice + 800;
            }

            // 31. Landscape
            var landscape = $('#landscape').val();
            console.log('landscape:', landscape);

            if(landscape == 'Economy'){
                newPrice = newPrice + 500;
            }
            else if(landscape == 'Average'){
                newPrice = newPrice + 750;
            }
            else if(landscape == 'Moderate'){
                newPrice = newPrice + 2000;
            }
            else if(landscape == 'Major'){
                newPrice = newPrice + 6000;
            }

            $('#newPrice').text(newPrice);
            // window.basePriceGL = basePrice;
            window.repairCost = newPrice;
            
            // console.log(window.price1);
        }
        

      


        // 4. What is the total Square footage of the property?
        $(document).on('keyup', '#finishedSqFt', function(){
            updatePrice();
            // updatePrice2();
        })

        // 8. How many bathrooms?
        $(document).on('keyup', '#bathrooms', function(){
            updatePrice();
            // updatePrice2();
        })

        // 10. What year was the property built?
        $(document).on('keyup', '#yearBuilt', function(){
            updatePrice();
            // updatePrice2();
        })

        
        // 12. Finishing Type?
        $(document).on('change', '#finishing_type', function(){
            updatePrice();
            // updatePrice2();
        })
        
        // 13. When was the bathrooms last updated?
        $(document).on('change', '#bathroom_update_date', function(){
            updatePrice();
            // updatePrice2();
        })

        // 17. What Type of cooling?
        $(document).on('change', '#cooling_type', function(){
            updatePrice();
            // updatePrice2();
        })

        // a. Age of unit
        $(document).on('change', '#cooling_age', function(){
            updatePrice();
            // updatePrice2();
        })

        // 18. What type of heating?
        $(document).on('change', '#heating_type', function(){
            updatePrice();
            // updatePrice2();
        })

        // a. Age of unit
        $(document).on('change', '#heating_age', function(){
            updatePrice();
            // updatePrice2();
        })

        // 19. What is the age of the water heater? 
        $(document).on('change', '#water_heater_age', function(){
            updatePrice();
            // updatePrice2();
        })

        // 21. When was the last time the flooring was updated?
        $(document).on('change', '#last_update_flooring', function(){
            updatePrice();
            // updatePrice2();
        })


        // 23. What is the condition of the electrical?
        $(document).on('change', '#electrical_condition', function(){
            updatePrice();
            // updatePrice2();
        })

        // 24. Have you noticed any foundation issues?
        $(document).on('change', '#foundation', function(){
            updatePrice();
            // updatePrice2();
        })


        // 26. What is the condition of the pool?
        $(document).on('change', '#pool_condition', function(){
            updatePrice();
            // updatePrice2();
        })


        // 28. Paint
        $(document).on('click', '[name="paint"]', function(){
            updatePrice();
            // updatePrice2();
        })

        // 29. Garage Doors
        $(document).on('click', '[name="garage_doors"]', function(){
            updatePrice();
            // updatePrice2();
        })

        // 30. Kitchen Appliances
        $(document).on('click', '[name="kitchen_appliance"]', function(){
            updatePrice();
            // updatePrice2();
        })
        
        // 31. Landscape
        $(document).on('change', '#landscape', function(){
            updatePrice();
            // updatePrice2();
        })

    }

    function initPageLogin(){
        $(document).on('click', '#login_btn', function(){

            if($('#email').val() == ''){
                alert('Please Input Email')
                $('#email').focus();
                return;
            }

            if($('#password').val() == ''){
                alert('Please Input Password')
                $('#password').focus();
                return;
            }

            $.ajax({
                url: '/api/login',
                data: {
                    email: $('#email').val(),
                    password: $('#password').val(),
                },
                type: 'get',
                dataType: 'json',
                success: function(response){
                    if(!response.success){
                        alert('Login Failed!');
                        return;
                    }
                    location.href='/calculator';
                }
            })
        })
    }

    function initPageRegister(){

        function checkUser(){
            $.ajax({
                url: '/api/check',
                data: {
                    email: $('#email').val()
                },
                type: 'get',
                dataType: 'json',
                success: function(response){
                    if(response.success){
                        registerUser();
                    }
                    else{
                        alert('User Email Already Exist!')
                    }
                }
            })
        }

        function registerUser(){
            $.ajax({
                url: '/api/register',
                data: {
                    name: $('#name').val(),
                    email: $('#email').val(),
                    phone: $('#phone').val(),
                    password: $('#password').val()
                },
                type: 'post',
                success: function(response){
                    alert('Register Successfully!');
                    location.href="/login";
                }
            })
        }
        $(document).on('click', '#signup_btn', function(){
            if($('#name').val() == ''){
                alert('Please Input Name')
                $('#name').focus();
                return;
            }

            if($('#email').val() == ''){
                alert('Please Input Email')
                $('#email').focus();
                return;
            }

            if($('#phone').val() == ''){
                alert('Please Input Phone')
                $('#phone').focus();
                return;
            }

            if($('#password').val() == ''){
                alert('Please Input Password')
                $('#password').focus();
                return;
            }

            if($('#password_confirm').val() == ''){
                alert('Please Input Confirm Password')
                $('#password_confirm').focus();
                return;
            }

            if($('#password').val() != $('#password_confirm').val()){
                alert("Password and Confirm Password isn't same");
                $('#password_confirm').focus();
                return;
            }

            checkUser();
        })
    }


    $(document).ready(function(){

        if($('#page_calculator').length != 0){
            initPageCalculator();
        }

        if($('#page_login').length != 0){
            initPageLogin();
        }

        if($('#page_register').length != 0){
            initPageRegister();
        }
    })
    
        $("#btnQueryString").bind("click", function () {
            var url = "/avg?p1=" + encodeURIComponent(window.AvgzillowEpp) +"&p2="+encodeURIComponent(window.repairCost);
            window.location.href = url;
        });
    
})(jQuery)

