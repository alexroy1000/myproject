function Product() {
    this.ID = 0;
    this.Name = "";
    this.Design_List = [];
}


Product.prototype.addDesign_Object = function (Name, PreviewImage,placementID,item) {
    var ID = product.Design_List.length;
    var designobj = {
                    ID:ID,
                    Name:Name,
                    previewImage:PreviewImage,
                    placementID: placementID,
                    shapes:[]
                };
    designobj.shapes.push(item);
    return designobj;

};
Product.prototype.getID = function(){
    var id = 0;
    if(product.Design_List.length>0)
    {
        for (var i = 0; i < product.Design_List.length; i++) {
            id += product.Design_List[i].shapes.length;
        }
    }
    return id;
}
Product.prototype.setSelectObj = function (item) {
    activeObj = item;
    var selectedObjId = item.id;
    var ca = item.sevData;
    if(item.objType == "image")
    {
        var html = '';
        $(".cliparteditor").show();
        $(".texteditorext").hide();

        if (removeobj == 0) {
        $('.cliparteditor').show();
            $(".colortab_custom").show();
            $(".texteditor").hide();
        }
        removeobj = 0;
        // Set value to html elements.

        for (var i = 0; i < ca.CanvasObject.Colors.length; i ++) {
            html += '<a class="btn btn-default colorpicker selectcolor" data-id="' + i 
                 + '" style="background-color: ' 
                 + ca.CanvasObject.Colors[i].HtmlColor 
                 + '"></a>';
        }

        if(item.sizelock)
        {
            item.setControlsVisibility({'bl': false, 'br': false, 'mb': false, 'ml': false, 'mr': false, 'mt': false});
            $('#clipart_width_text,  #clipart_width_range').prop('disabled', true);
            $('#clipart_height_text, #clipart_height_range').prop('disabled', true);
        }
        else
        {
            item.setControlsVisibility({'bl': true, 'br': true, 'mb': true, 'ml': true, 'mr': true, 'mt': true});
            $('#clipart_width_text,  #clipart_width_range').prop('disabled', false);
            $('#clipart_height_text, #clipart_height_range').prop('disabled', false);
        }

        $('.colorlayer').html(html);
        $('#clipart_width_text,  #clipart_width_range').val( parseFloat(item.getWidth()) );
        $('#clipart_height_text, #clipart_height_range').val( parseFloat(item.getHeight()) );
        $('#clipart_angle_text,  #clipart_angle_range').val( item.getAngle());

        $('#clipart_layer').find('li.active').removeClass('active');
        $('#clipart_layer').find("[data-id='image_" + selectedObjId + "']").addClass('active');
        // create design_colors array of selected clipart.

        ratio = item.getWidth() / item.getHeight();

        canvas.renderAll();
    }
    else if(item.objType == "text")
    {
    $(".cliparteditor").hide();
    $(".texteditor").show();
    if (removeobj == 0) {
        $(".colortab_custom").show();
        if(isSelectClipObj == 0)
        {
            $(".texteditor").show();
            $('.cliparteditor').hide();
        }
        else{
            $(".texteditor").hide();
            $('.cliparteditor').show();
        }
    }
    removeobj = 0;
    // Set value to html elements.
        item.setControlsVisibility({'bl': true, 'br': true, 'mb': true, 'ml': true, 'mr': true, 'mt': true});
        $('#clipart_width_text,  #clipart_width_range').prop('disabled', false);
        $('#clipart_height_text, #clipart_height_range').prop('disabled', false);
    
    // $('#clipart_size_text,  #clipart_size_range').val( parseFloat(selectedObj.getFontSize()) );
    // $('#clipart_spacing_text, #clipart_spacing_range').val( parseFloat(selectedObj.spacing) );
    $('#clipart_rotate_text,  #clipart_rotate_range').val( item.getAngle() );
    // $('#clipart_arc_text,  #clipart_arc_range').val( selectedObj.radius );

    $('#clipart_layer').find('li.active').removeClass('active');
    $('#clipart_layer').find("[data-id='text_" + selectedObjId + "']").addClass('active');
    $('#lock').attr('data-lock', 'false');
    $('#lock').css('background-position', '0 -3650px');

    item.setControlsVisibility({'bl': true, 'br': true, 'mb': true, 'ml': true, 'mr': true, 'mt': true});
    $('#clipart_width_text,  #clipart_width_range').prop('disabled', false);
    $('#clipart_height_text, #clipart_height_range').prop('disabled', false);

     // var html = '';
     // html += '<a class="btn btn-default colorpicker selectcolor" data-id="0" style="background-color: ' 
     //         + "red" 
     //         + '"></a>';
     //  $('.colorlayer').html(html);
    }
};
Product.prototype.updateImageDesign = function (item,i,colorstr){
    if (item == null ) {
        alert('Please select a Object.');
        return;
    }
    var  ca = item.sevData;
    ca.CanvasObject.Colors[i].HtmlColor = colorstr;
    var   source = getCanvasObjects([ca.CanvasObject],item.objType);
    var   changeitem = new fabric.Image(source, {        
            left:   item.left,
            top:    item.top,
            width:  item.getWidth(),
            height: item.getHeight(),
            angle:  item.getAngle(),
            sizelock : false,
            originX: 'center',
            originY: 'center',
            name : ca.Name,
            objID:ca.ID,
            sevData:ca,
            placementID : item.placementID
        });  
    changeitem.sizelock = ca.LockSize;
    item.sizelock = ca.LockSize;
    changeitem.set('id',item.id);
    changeitem.set('objType', item.objType);
    canvas.add(changeitem);
    canvas.remove(item);
    canvas.setActiveObject(changeitem);
    for (var i =0 ; i<product.Design_List.length  ; i++) {     
       if( product.Design_List[i].placementID == item.placementID)
       {
            
            for (var j = 0; j < product.Design_List[i].shapes.length; j++) {
                if(product.Design_List[i].shapes[j].id == changeitem.id)
                {
                    product.Design_List[i].shapes[j] = changeitem;
                }
            }
            break;
       }

    }
    var cid = changeitem.objType + '_' + changeitem.id; 
    var mycanvas = document.getElementById(cid);
    var myctx    = mycanvas.getContext('2d');
    myctx.drawImage(source, 0, 0, source.width, source.height, 0, 0, 35, 35);
     
};
Product.prototype.updateTextDesign= function(item, fontid, str, fillcolor, strokecolor){
   if (item == null ) {
        alert('Please select a Object.');
        return;
    }
    var changeitem    = getCharacters(fontid, item.text,fillcolor,strokecolor);
   
   changeitem.set('id', item.id);
   changeitem.set('objType', 'text');
   changeitem.set('fillColor', fillcolor);
   changeitem.set('strokeColor', strokecolor);
   changeitem.set('text',str);
   changeitem.set('placementID',item.placementID);
   changeitem.scale(0.1);
   changeitem.sizelock = false;
   //_render(item);
   canvas.remove(item);
   canvas.add(changeitem);
   
   // preview image
   canvas.setActiveObject(changeitem); 
   product.setSelectObj(changeitem);
    for (var i =0 ; i<product.Design_List.length  ; i++) {     
        if( product.Design_List[i].placementID == item.placementID)
        {
        //product.Design_List[i].shapes.push(item);
            for (var j = 0; j < product.Design_List[i].shapes.length; j++) {
                if(product.Design_List[i].shapes[j].id == changeitem.id)
                {
                    product.Design_List[i].shapes[j] = changeitem;
                }
            }
            break;
        }

    }
   // $('#clipart_layer').find('li.active').removeClass('active');
   // $('#clipart_layer').prepend('<li class="active" data-id="text_' + id + '"><a data-href="#"><img width="35" height="35" style="border-color:1px solid gray" id="text_' + id + '"></a></li>');
   $('#clipart_layer').find('#text_' + changeitem.id).attr('src', changeitem.toDataURL('png'));
   
}
var product;
var sessionid;
var fonts = [];
var activeObj = null;
var removeobj = 0;
var isSelectedColor = false;
var isSelectClipObj = 0;
var graytlx = 0;
var graytly = 0;
var graywidth = 0;
var grayheight = 0;
var lpos = 0;
var tpos = 0;
var gwidth = 0;
var gheight = 0;

jQuery(document).ready(function() {
    login();
});


function login() {
    var xml = '<request><clientname>Sparkly Tees</clientname><sitekey>C7488241-3948-4827-BF7C-86D8A63AC51F</sitekey></request>';

    $.ajax({
        type: "POST",
        url: url + "/Site.svc/SiteLogin",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function(response) {
            var r = response.SiteLoginResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            } else {
                sessionid = r.SessionID;
                listFonts();
                listClipArt();
                getColorPalette();
                listPlacement();
                var mycanvas = document.getElementById('myCanvas');
                var myctx = mycanvas.getContext('2d');
                drawGrid();
                product = new Product();
            }
        },
        error: function(xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}

function getFont(fontid) {
    var xml = "<request><sessionid>" + sessionid + "</sessionid><fontid>" + fontid + "</fontid></request>";
    $.ajax({
        type: "POST",
        url: url + "/Site.svc/FontGet",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function(response) {
            var r = response.FontGetResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")");
                return;
            } else {
                fonts[fontid] = eval(r.Data)[0];
                // console.log(fonts);
                // document.getElementById('tbx').focus();
            }
        }
    });
}

// Convert from data array to canvas object.
function getCanvasObjects(data_array,objtype) {
    var log     = false;
    var width   = 0;
    var height  = 0;
    var gap     = 10;
    var x       = 0;
    var y       = 0;
    var baseline = 0;
    
    for (var i = 0; i < data_array.length; i++) {
        var c = data_array[i];
        if (x == 0) {
            x = c.Width / 2;
        }
        if (c.Height > height) {
            height = c.Height;
        }   
        width += c.Width;
        width += gap;
    }
    width -= gap;
    if(objtype=="image")
    {
        height = c.Height;
    y = c.Height / 2;
    }
    else if(objtype=="text")
    {
        height = c.Height + 200;
        y = c.Height;
    }
      
    
    var cTemp = document.createElement('canvas');
    cTemp.width  = width;
    cTemp.height = height;
    var ctx = cTemp.getContext('2d');
    for (var da = 0; da < data_array.length; da++) {
        var data = data_array[da];
        for (var i = 0; i < data.Groups.length; i++) {
            var g = data.Groups[i];
            for (var j = 0; j < g.Paths.length; j++) {
                var p = g.Paths[j];
                var a = eval(p.Command);
                if (log) console.log(p.Command);
                switch (a[0]) {
                    case 'BP':
                        ctx.beginPath();
                        if (log) console.log('ctx.beginPath();');
                        break;
                    case 'MT':
                        ctx.moveTo((x + a[1]), (y + a[2]));
                        if (log) console.log('ctx.moveTo(' + (x + a[1]) + ',' + (y + a[2]) + ');');
                        break;
                    case 'LT':
                        ctx.lineTo((x + a[1]), (y + a[2]));
                        if (log) console.log('ctx.lineTo(' + (x + a[1]) + ',' + (y + a[2]) + ');');
                        break;
                    case 'BCT':
                        ctx.bezierCurveTo((x + a[1]), (y + a[2]), (x + a[3]), (y + a[4]), (x + a[5]), (y + a[6]));
                        if (log) console.log('ctx.bezierCurveTo(' + (x + a[1]) + ',' + (y + a[2]) + ',' + (x + a[3]) + ',' + (y + a[4]) + ',' + (x + a[5]) + ',' + (y + a[6]) + ');');
                        break;
                    case 'CP':
                        ctx.closePath();
                        if (log) console.log('ctx.closePath();');
                        break;
                }
            }

            if (g.Fill !== undefined) {
                if ( g.Fill.HtmlColor.indexOf('img_pattern') != -1) {
                    var image = document.getElementById(g.Fill.HtmlColor);
                    ctx.fillStyle = ctx.createPattern(image, "repeat");
                } else { 
                    ctx.fillStyle = g.Fill.HtmlColor.replace(new RegExp("'", 'g'), "");
                }

                ctx.mozFillRule = 'evenodd';
                ctx.fill('evenodd');
                if (log) {
                    console.log('ctx.fillStyle = ' + g.Fill.HtmlColor + ';');
                    console.log('ctx.mozFillRule = \'evenodd\';');
                    console.log('ctx.fill(\'evenodd\');');
                }
            }

            if (g.Stroke != undefined) {
                ctx.strokeStyle = g.Stroke.HtmlColor;
                ctx.lineWidth   = g.StrokeWidth;
                ctx.stroke();
                if (log) {
                    console.log('ctx.strokeStyle = ' + g.Stroke.HtmlColor + ';');
                    console.log('ctx.lineWidth = '   + g.StrokeWidth      + ';');
                    console.log('ctx.stroke();');
                }
            }
        }
        x += ((data.Width / 2) + gap);
        if (da + 1 < data_array.length)
            x += (data_array[da + 1].Width / 2);
    }

    return (cTemp);
}

function getCharacters(fontid, characters, fillcolorstr, strokecolor,x,y) {
 var cliparts    = [];
    var spacing     = 1;
    var left        = canvas.width / 2;
    var height      = 0;
    // console.log(fontid);
    // console.log(fonts[fontid]);
    for (var i = 0; i < characters.length; i++) {
        for (var j = 0; j < fonts[fontid].Characters.length; j++) {

            var c = fonts[fontid].Characters[j];
            c.CanvasObject.Groups[0].Stroke = {
             HtmlColor:strokecolor,
             Pattern:""
            }
            if (c.Character == characters[i]) {
                // console.log(c.Character + ':' + c.CanvasObject.Height)
                if (c.CanvasObject.Height > height) {
                    height = c.CanvasObject.Height;
                    
                }
                c.CanvasObject.Groups[0].Fill.HtmlColor = fillcolorstr;
                c.CanvasObject.Groups[0].StrokeWidth = 15;
                cliparts.push(new fabric.Image(getCanvasObjects([c.CanvasObject],"text"), {                   
                    left    : left,
                    top     : canvas.height / 2,
                    originX : 'left',
                    originY : 'bottom',
                    width   : c.CanvasObject.Width,
                    height  : c.CanvasObject.Height,
                    // stroke  : '#1c1a1c',
                    // strokeWidth: 5,
                    
                }));
                // console.log("getCharacters, c.CanvasObject.ID:" + c.CanvasObject.ID);
                left += c.CanvasObject.Width + spacing;
                break;
            }
        }
    }
    
    var grp = new fabric.Group(cliparts, {
        left: canvas.width / 2,
        top: canvas.height / 2,
    });

    return  grp;
}

function _render(source) {
    var left = source.left;
    var top = source.top;
    var scaleX = source.getScaleX();
    var scaleY = source.getScaleY();

    // Make a arced text.
    /*var radius  = 4000;
    var arc     = 10;
    var reverse = false;
    var align   = 'center';
    var arclength = 0;

    if ( align === 'center' ) {
        align = ( arc / 2) * ( source.size() - 1) ;
    } else if ( align === 'right' ) {
        align = ( arc ) * ( source.size() - 1) ;
    }

    for ( var i = 0; i < source.size(); i ++) {
        // Find coords of each letters (radians : angle*(Math.PI / 180)
        if ( reverse ) {
            curAngle = (-i * parseInt( arc, 10 )) + align;
            angleRadians = curAngle * (Math.PI / 180);
            source.item(i).set( 'top', (Math.cos( angleRadians ) * radius));
            source.item(i).set( 'left', (-Math.sin( angleRadians ) * radius) );
        } else {
            curAngle = (i * parseInt( arc, 10)) - align;
            angleRadians = curAngle * (Math.PI / 180);
            source.item(i).set( 'top', (-Math.cos( angleRadians ) * radius) );
            source.item(i).set( 'left', (Math.sin( angleRadians ) * radius) );
        }

        source.item(i).setAngle( curAngle );
    }
    */
    // Update group coords
    source._calcBounds();
    source._updateObjectsCoords();
    source.top = top;
    source.left = left;
    source.saveCoords();
    
    source.setScaleX(scaleX);
    source.setScaleY(scaleY);
    
    canvas.renderAll();
}
function drawCharacters(fontid, $that, x, y,fillcolorstr,strokecolorstr,placementID) {
    var characters = $that.val();
    if (characters.length == 0)
    return;
    var id      = product.getID();
    var item    = getCharacters(fontid, characters, fillcolorstr,strokecolorstr);
   // console.log(item);
    item.set('id', id);
    item.set('objType', 'text');
    item.set('fillColor', fillcolorstr);
    item.set('strokeColor', strokecolorstr);
    item.set('text',characters);
    item.set('placementID',placementID);
    item.scale(0.1);
    item.sizelock = false;
    _render(item);
    canvas.add(item);
    activeObj = item;
    if(product.Design_List.length>0)
    {
        for (var i =0 ; i<product.Design_List.length  ; i++) {
            
           if( product.Design_List[i].placementID == placementID)
           {
                product.Design_List[i].shapes.push(item);
           }
           else{
                product.Design_List.push(product.addDesign_Object("","",placementID,item));
            }
        }
    }
    else{
        product.Design_List.push(product.addDesign_Object("","",placementID,item));

    }
    canvas.setActiveObject(item);
    // object layer
    $('#clipart_layer').find('li.active').removeClass('active');
    $('#clipart_layer').prepend('<li class="active" data-id="text_' + id + '"><a data-href="#"><img width="35" height="35" style="border-color:1px solid gray" id="text_' + id + '"></a></li>');
	$('#clipart_layer').find('#text_' + id).attr('src', item.toDataURL('png'));
    product.setSelectObj(item);
}
function listFonts() {
    var xml = "<request><sessionid>" + sessionid + "</sessionid></request>";

    $.ajax({
        type: "POST",
        url: url + "/Site.svc/FontList",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function(response) {
            var r = response.FontListResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")");
                return;
            } else {
                var data = eval(r.Data);
                for (var i = 0; i < data.length; i++) {
                    var f = data[i];
                    $('#dlFonts_form').append($('<option>', {
                        value: f.ID,
                        text: f.Name
                    }));
                    getFont(f.ID);
                }
            }
        }
    });
}

function listClipArt() {
    var xml = "<request><sessionid>" + sessionid + "</sessionid></request>";
    $.ajax({
        type: "POST",
        url: url + "/Site.svc/ClipArtList",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function(response) {
            var r = response.ClipArtListResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")");
                return;
            } else {
                var data = eval(r.Data);
                for (var i = 0; i < data.length; i++) {
                    var c = data[i];
                    $('#listClipArt').append($('<li>', {
                        id: c.ID,
                        html: c.Name,
                        "data-type":"image",
                        "data-name":c.Name,
                        "data-locksize":c.LockSize,

                    }));
                    
                }
            }
        }
    });
}

function listPlacement() {
    var xml = "<request><sessionid>" + sessionid + "</sessionid></request>";
    $.ajax({
        type: "POST",
        url: url + "/Site.svc/PlacementList",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.PlacementListResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")");
                return;
            } else {
                var data = eval(r.Data);
                for (var i = 0; i < data.length; i++) {
                    var p = data[i];
                    $(".placement-modal .modal-body").append("<div style='float:left;'><IMG src='http://api.thetshirtguylv.com/image/placement/" + p.PreviewImage + "' data-width='"+p.Width+"' data-height='"+p.Height+"' data-name='"+p.Name+"' data-overlap='"+p.Overlap+"' data-id='"+p.ID+"'/><br><p align='center'>" + p.Name + "</p></div>");
                }
            }
        }
    });
}

// Update Object's color.
function updateObjColor() {
    // Get selected Object.
    var selectedObj = canvas.getActiveObject();

    if (selectedObj == null ) {
        alert('Please select a clipart.');
        return;
    }

    var selectedObjId = selectedObj.id;
    var selectedObjType = selectedObj.type;
    var ca;
    var source;
    var item;

    if(selectedObjType == 'image') {
        ca = design_clipart[selectedObjId];   
        source = getCanvasObjects([ca.CanvasObject],selectedObjType);
         // Add mix colored Object.
        item = new fabric.Image(source, {        
            left:   selectedObj.left,
            top:    selectedObj.top,
            width:  selectedObj.getWidth(),
            height: selectedObj.getHeight(),
            angle:  selectedObj.getAngle(),
            // opacity : 0.5,
            originX: 'center',
            originY: 'center'
        }); 
    }
    else{

        ca = design_clipart[selectedObjId];
        source = getCanvasObjects([ca.CanvasObject],selectedObjType);
        item = new fabric.Image(source, {        
            left:   selectedObj.left,
            top:    selectedObj.top,
            width:  selectedObj.getWidth(),
            height: selectedObj.getHeight(),
            angle:  selectedObj.getAngle(),
            // opacity : 0.5,
            originX: 'center',
            originY: 'center'
        });
    }

    // item.scale(0.2);

    item.set('id', selectedObjId);
    item.set('objType', selectedObjType);
    canvas.add(item);
   
    // Remove selected Object.
    canvas.remove(selectedObj);

    // Set active new object.
    canvas.setActiveObject(item);

    // Update object layer's image.
    var cid = selectedObjType + '_' + selectedObjId;
    $('#clipart_layer').find("[data-id='" + cid + "']").attr('src', item.toDataURL('png'));
                    
    var mycanvas = document.getElementById(cid);
    var myctx    = mycanvas.getContext('2d');

    myctx.drawImage(source, 0, 0, source.width, source.height, 0, 0, 35, 35);
}

function drawClipArt(clipartid, x, y, placementID) {
    var xml = "<request><sessionid>" + sessionid + "</sessionid><clipartid>" + clipartid + "</clipartid></request>";
    
    $.ajax({
        type: "POST",
        url: url + "/Site.svc/ClipArtGet",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function(response) {
            var r = response.ClipArtGetResult;

            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")");
                return;
            } else {
                var ca = eval(r.Data)[0];
                design_colors = [];
                for (var i = 0; i < ca.CanvasObject.Colors.length; i++) {
                    var isFound = false;
                    for (var j = 0; j < design_colors.length; j++) {
                        if (ca.CanvasObject.Colors[i].ID == design_colors[j].ID) {
                            ca.CanvasObject.Colors[i] = design_colors[j];
                            isFound = true;
                            break;
                        }
                    }

                    if (isFound == false) {
                        design_colors[design_colors.length] = ca.CanvasObject.Colors[i];
                        ca.CanvasObject.Colors[i] = design_colors[design_colors.length - 1];
                    }
                }

                // Set Group Colors to design_color array //
                for (var i = 0; i < ca.CanvasObject.Groups.length; i++) {
                    for (var j = 0; j < design_colors.length; j++) {
                        if (ca.CanvasObject.Groups[i].Fill.HtmlColor == design_colors[j].HtmlColor) {
                            ca.CanvasObject.Groups[i].Fill = design_colors[j];
                        }
                    }
                }

                var id = product.getID(); 
                var cid = 'image_' + id;
                $('#clipart_layer').find('li.active').removeClass('active');
                $('#clipart_layer').prepend('<li class="active" data-id="' + cid + '"><a data-href="#home"><canvas width="35" height="35" style="border-color:1px solid gray" id="' + cid + '"></canvas></a></li>');
                
                var source   = getCanvasObjects([ca.CanvasObject],"image");
                var mycanvas = document.getElementById(cid);
                var myctx    = mycanvas.getContext('2d');

                var newWidth  = source.width    / 2;
                var newHeight = source.height   / 2;
                var positionX = x - (newWidth   / 2);
                var positionY = y - (newHeight  / 2);

                myctx.drawImage(source, 0, 0, source.width, source.height, 0, 0, 35, 35);
                
                // console.log('source.width='+source.width+','+ 'source.height'+source.height+','+ 'positionX='+','+positionX +'positionY'+positionY+','+ 'newWidth'+newWidth+',' +'newHeight'+newHeight);
                
                var h = 200 * source.height / source.width;
                var item = new fabric.Image(source, {
                    left: canvas.width /2,
                    top:  canvas.height/2,
                    width: 200,
                    height: h,
                    sizelock: 'false',
                    // opacity : 0.5
                    placementID : placementID,
                    originX: 'center',
                    originY: 'center',
                    name:ca.Name,
                    objId:ca.ID,
                    sevData:ca,
                });

                item.sizelock = ca.LockSize;
                item.set('id', id);
                item.set('objType', 'image');
                canvas.add(item);
                canvas.setActiveObject(item);
                activeObj = item;
                if(product.Design_List.length>0)
                {
                    for (var i =0 ; i<product.Design_List.length  ; i++) {
                        
                       if( product.Design_List[i].placementID == placementID)
                       {
                            product.Design_List[i].shapes.push(item);
                       }
                       else{
                            product.Design_List.push(product.addDesign_Object("","",placementID,item));
                        }
                    }
                }
                else{
                    product.Design_List.push(product.addDesign_Object("","",placementID,item));
 
                }
                var html = '';
                // Set values in html elements.
                for (var i = 0; i < ca.CanvasObject.Colors.length; i ++) {
                    html += '<a class="btn btn-default colorpicker selectcolor" data-id="' + i 
                         + '" style="background-color: ' 
                         + ca.CanvasObject.Colors[i].HtmlColor 
                         + '"></a>';
                }   
                $('.colorlayer').html(html);
                $('#clipart_width_text,  #clipart_width_range').val( parseFloat(item.getWidth()) );
                $('#clipart_height_text, #clipart_height_range').val( parseFloat(item.getHeight()));
                $('#clipart_angle_text,  #clipart_angle_range').val( item.getAngle());
                product.setSelectObj(item);
            }
        }
    });
}


function drawGrid() {
    var gridWidth  = canvas.width;  // <= you must define this with final grid width
    var gridHeight = canvas.height; // <= you must define this with final grid height

    var groupArray = [];
    // to manipulate grid after creation

    var gridSize = 20; // define grid size

    // define presentation option of grid
    var lineOption = {stroke: '#eee', strokeWidth: 1, selectable:false, strokeDashArray: [0, 0]};

    // do in two steps to limit the calculations
    // first loop for vertical line
    for(var i = Math.ceil(gridWidth / gridSize); i--;) {
        groupArray.push(new fabric.Line([gridSize*i, 0, gridSize*i, gridHeight], lineOption) );
    }
    // second loop for horizontal line
    for(var i = Math.ceil(gridHeight / gridSize); i--;) {
        groupArray.push(new fabric.Line([0, gridSize*i, gridWidth, gridSize*i], lineOption) );
    }

    // Group add to canvas
    var oGridGroup = new fabric.Group(groupArray, {
        left: 0, 
        top: 0, 
        originX: 'left', 
        originY: 'top', 
        selectable:false, 
        hoverCursor:'pointer'
    });
    canvas.add(oGridGroup);
}
function drawGrayGrid(w, h){
    w =w*55;
    h =h*55;
    var gridlp  = canvas.width/2-w/2;  // <= you must define this with final grid width
    var gridtp = canvas.height/2-h/2; // <= you must define this with final grid height
    graytlx = gridlp;
    graytly = gridtp;
    graywidth = w;
    grayheight = h;
    var groupArray = [];
    // to manipulate grid after creation

    var gridSize = 20; // define grid size

    // define presentation option of grid
    var lineOption = {stroke: '#fff', strokeWidth: 1, selectable:false, strokeDashArray: [0, 0]};

    // do in two steps to limit the calculations
    // first loop for vertical line
    for(var i = Math.ceil(w / gridSize); i--;) {
        groupArray.push(new fabric.Line([gridSize*i, 0, gridSize*i, h], lineOption) );
    }
    // second loop for horizontal line
    for(var i = Math.ceil(h / gridSize); i--;) {
        groupArray.push(new fabric.Line([0, gridSize*i, w, gridSize*i], lineOption) );
    }

    // Group add to canvas
    var rect = new fabric.Rect({
    left: gridlp,
    top: gridtp,
    originX: 'left', 
    originY: 'top', 
    width: w,
    height: h,
    fill: '#eee',
    selectable:false, 
    hoverCursor:'pointer'
  });
    var nGridGroup = new fabric.Group(groupArray, {
        left: gridlp, 
        top: gridtp, 
        originX: 'left', 
        originY: 'top', 
        selectable:false, 
        hoverCursor:'pointer'
    });
    canvas.add(rect);
    canvas.add(nGridGroup);
}

function getColorPalette() {
    
    $('.tab_custom').css("height", $('.colortab_custom'));
    var col_array = [];
    var col_name_array = [];
    var img_dir_array = [] ;
    var img_pat_array = [] ;
    var img_name_array = [] ;
    var col_group_name = "";
    var pattern_group_name = "";
    
    var xml = "<request><sessionid>" + sessionid + "</sessionid></request>";
    
    $.ajax({
        type: "POST",
        url: url + "/Site.svc/ColorPaletteGet",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.ColorPaletteGetResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")");
                return;
            } else {
                
                var data = eval(r.Data);
                var p = data[0];
                for (var x = 0; x < p.ColorPaletteGroups.length; x++) {
                    
                    var g = p.ColorPaletteGroups[x];
                    // g.Name,g.PriceIncrease g.id
                    for (var y = 0; y < g.ColorPaletteItems.length; y++) {

                        var i = g.ColorPaletteItems[y];
                        // is color?
                        if (i.HtmlColor != "")
                        {
                            col_group_name = g.Name;
                            col_array[y] = i.HtmlColor;
                            col_name_array[y] = i.MediaColorName;
                        }
                        // is pattern?
                        else if(i.HtmlColor == "" && i.PreviewImage != "" )
                        {
                            pattern_group_name = g.Name;
                            img_dir_array[y]   = i.PreviewImage;
                            img_name_array[y]  = i.MediaColorName;
                            img_pat_array[y]   = i.PatternImage;
                            // console.log(y+img_dir_array[y]);
                        }
                        // console.log(i.PatternImage);
                        /* 
                        This is Object Item of ColorpaletteItems
                        i.ID,MediaColorID,MediaColorName,HtmlColor,PatternImage,PreviewImage,MediaColorTypeID,MediaColorTypeName 
                        */
                    }
                }
                var strx = "";
                var stry = "";
                for (var i = 0; i < col_array.length; i++) {
                    strx += "<a class='btn btn-default selectcolor' style='background:"+col_array[i]+";' title='"+col_name_array[i] +"'></a>";
                }

                for (var i = 0; i < img_dir_array.length; i++) {
                    //console.log(img_dir_array.length);
                    stry += "<a class='btn btn-default selectcolor' style='background-image:url(" + url + img_dir_array[i] + ");margin-top:3px; margin-left :3px' title='" + img_name_array[i] + "'></a>";
                    stry += "<img id='img_pattern_" + i + "' src='" + url + img_pat_array[i] + "' style='display:none'>";

                    // var img = new Image();
                    // img.crossOrigin="anonymous";
                }    
                $('.cliparteditor #colorpad').html(strx);
                $('.cliparteditor #patternpad').html(stry);
                $('.cliparteditor #colorx').html("<span class='glyphicon glyphicon-menu-down' aria-hidden='true'></span>  " + col_group_name);
                $('.cliparteditor #patternx').html("<span class='glyphicon glyphicon-menu-down' aria-hidden='true'></span>  " + pattern_group_name);
                $('.texteditor #colorpad').html(strx);
                $('.texteditor #patternpad').html(stry);
                $('.texteditor #colorx').html("<span class='glyphicon glyphicon-menu-down' aria-hidden='true'></span>  " + col_group_name);
                $('.texteditor #patternx').html("<span class='glyphicon glyphicon-menu-down' aria-hidden='true'></span>  " + pattern_group_name);
            }
        }
    });
}
// Select a color layer.

$('body').on('click', '.colorlayer a', function(event) {
    $('.colorlayer').find('a.active').removeClass('active');
    $(this).addClass('active');
});

// Select a color in color pad.
$('body').on('click', '#colorpad a', function(event) {
    $('.colorlayer').find('a.active').css('background-color', $(this).css('background-color'));
    $('.colorlayer').find('a.active').css('background-image', '');
    isSelectedColor = true;
    activeObj = canvas.getActiveObject();

    if(activeObj.type =="image")
    {
     product.updateImageDesign(canvas.getActiveObject(),$('.colorlayer').find('a.active').attr('data-id'),$(this).css('background-color'));
    }
    else{
     product.updateTextDesign(activeObj,$('#dlFonts_form').val(),activeObj.text, $('#fillcolor').css('background-color'),$('#strokecolor').css('background-color'));
    }
    
});
// Select a pattern in pattern pad.
$('body').on('click', '#patternpad a', function(event) {
    $('.colorlayer').find('a.active').css('background-color', '');
    $('.colorlayer').find('a.active').css('background-image', $(this).css('background-image'));
    isSelectedColor = true;
    activeObj = canvas.getActiveObject();
    if(activeObj.type =="image")
    {
     product.updateImageDesign(activeObj,$('.colorlayer').find('a.active').attr('data-id'),$(this).next().attr('id'));
    }
    else{
     product.updateTextDesign(activeObj,$('#dlFonts_form').val(),activeObj.text, $('#fillcolor').css('background-image'), $('#strokecolor').css('background-image'));
    }
});

var ratio;

var isChagingAngle = false;
$('#clipart_angle_text, #clipart_angle_range').mousedown(function(event) {
    isChagingAngle = true;
}).mousemove(function () {
    if (! isChagingAngle) return;

    var selectedObj = canvas.getActiveObject();
    if (selectedObj == null) 
        return;

    var val = parseInt($(this).val());
    selectedObj.setAngle(val);

    $('#clipart_angle_text, #clipart_angle_range').val(val);
    canvas.renderAll();
}).mouseup(function(event) {
    isChagingAngle = false;
});

// ---------------------------------------------------------------------------
// clipart width
var isChagingWidth = false;
$('#clipart_width_text, #clipart_width_range').mousedown(function(event) {
    isChagingWidth = true;
}).mousemove(function () {
    if (! isChagingWidth) return;

    
    var selectedObj = canvas.getActiveObject();
    if (selectedObj == null) 
        return;

    var val = parseFloat($(this).val());
    //console.log(ratio);
    if ($('#lock').attr('data-lock') == 'true') {
        selectedObj.setHeight(val / ratio);
        $('#clipart_height_text, #clipart_height_range').val(val / ratio);
    }

    selectedObj.setWidth(val);
    $('#clipart_width_text, #clipart_width_range').val(val);
    canvas.renderAll();    
    
}).mouseup(function(event) {
    isChagingWidth = false;
});

// ---------------------------------------------------------------------------
// clipart height
var isChagingHeight = false;
$('#clipart_height_text, #clipart_height_range').mousedown(function(event) {
    isChagingHeight = true;
}).mousemove(function(event) {
    if (! isChagingHeight) return;

    var selectedObj = canvas.getActiveObject();
    if (selectedObj == null) 
        return;

    var val = parseFloat($(this).val());
    //console.log(canvas);
    if ($('#lock').attr('data-lock') == 'true') {
        selectedObj.setWidth(val * ratio);
        $('#clipart_width_text, #clipart_width_range').val(val * ratio);
    }
    selectedObj.setHeight(val);
    $('#clipart_height_text, #clipart_height_range').val(val);
    canvas.renderAll();
    
}).mouseup(function(event) {
    isChagingHeight = false;
});

// ---------------------------------------------------------------------------
// text rotate
$('#clipart_rotate_text, #clipart_rotate_range').mousedown(function(event) {
    isChagingAngle = true;
}).mousemove(function () {
    if (! isChagingAngle) return;

    var selectedObj = canvas.getActiveObject();
    if (selectedObj == null) 
        return;
    var val = parseInt($(this).val());
    selectedObj.setAngle(val);
    $('#clipart_rotate_text, #clipart_rotate_range').val(val);

    canvas.renderAll();
}).mouseup(function(event) {
    isChagingAngle = false;
});

// ---------------------------------------------------------------------------
// Text arc
$('#clipart_arc_text, #clipart_arc_range').mousedown(function(event) {
    isChagingAngle = true;
}).mousemove(function () {
    if (! isChagingAngle) return;

    var selectedObj = canvas.getActiveObject();
    if (selectedObj == null)
        return;
    var val = parseInt($(this).val());
    selectedObj.set('radius', val);
    $('#clipart_arc_text, #clipart_arc_range').val(val);

    canvas.renderAll();
}).mouseup(function(event) {
    isChagingAngle = false;
});

// ---------------------------------------------------------------------------
// Text spacing
$('#clipart_spacing_text, #clipart_spacing_range').mousedown(function(event) {
    isChagingAngle = true;
}).mousemove(function () {
    if (! isChagingAngle) return;

    var selectedObj = canvas.getActiveObject();
    if (selectedObj == null || selectedObj.getBoundingRectWidth() > canvas.width) 
        return;

    var val = parseInt($(this).val());
    // selectedObj.set('spacing', val);
    var left = selectedObj.item(0).left;
    for (var i = 0; i < selectedObj.size(); i ++) {
        selectedObj.item(i).left = left;
        
        left += selectedObj.item(i).getWidth() + val * 1 / selectedObj.getScaleX();
    }
    _render(selectedObj);

    $('#clipart_spacing_text, #clipart_spacing_range').val(val);

    
}).mouseup(function(event) {
    isChagingAngle = false;
});

// ---------------------------------------------------------------------------
// Text stretch
var isChagingWidth = false;
$('#clipart_stretch_text, #clipart_stretch_range').mousedown(function(event) {
    isChagingWidth = true;
}).mousemove(function () {
    if (! isChagingWidth) return;

    var selectedObj = canvas.getActiveObject();
    if (selectedObj == null) 
        return;

    var val = parseFloat($(this).val());
    val = val * 10;
    if(val > canvas.width)
        val = canvas.width;
    selectedObj.scaleWidth(val);
    $('#clipart_stretch_text, #clipart_stretch_range').val(val);
    _render(selectedObj);

}).mouseup(function(event) {
    isChagingWidth = false;
});

// ---------------------------------------------------------------------------
// Text lnheight
var isChagingHeight = false;
$('#clipart_lnheight_text, #clipart_lnheight_range').mousedown(function(event) {
    isChagingHeight = true;
}).mousemove(function(event) {
    if (! isChagingHeight) return;
    var selectedObj = canvas.getActiveObject();
    if (selectedObj == null) 
        return;

    var val = parseFloat($(this).val());
    val = val * 5;
    if(val > canvas.height)
        val = canvas.height;
    selectedObj.scaleHeight(val);
    $('#clipart_lnheight_text, #clipart_lnheight_range').val(val);
    _render(selectedObj);

}).mouseup(function(event) {
    isChagingHeight = false;
});

// ---------------------------------------------------------------------
// text size
$('#clipart_size_text, #clipart_size_range').mousedown(function(event) {
    isChagingAngle = true;
}).mousemove(function () {
    if (! isChagingAngle) return;

    var selectedObj = canvas.getActiveObject();
    if (selectedObj == null)
        return;

    var val = parseInt($(this).val());
    selectedObj.scale(val);
    $('#clipart_size_text, #clipart_size_range').val(val);

    canvas.renderAll();
}).mouseup(function(event) {
    isChagingAngle = false;
});


$('.layer_up').click(function(event) {
    var selectedObj = canvas.getActiveObject();
    if (selectedObj == null) 
        return;
    if (selectedObj) {
              selectedObj.bringToFront();
            }
    //selectedObj.bringToFront();
    
    // Update object tab
    var id      = selectedObj.id;
if(selectedObj.objType == "image")
    {
        var selLi   = $('#clipart_layer').find("[data-id='image_" + selectedObj.id + "']");    
    }
    else
    {
        var selLi   = $('#clipart_layer').find("[data-id='text_" + selectedObj.id + "']");       
    }
    var prev    = selLi.prev();
    prev.before(selLi);
    canvas.renderAll();
});

$('.layer_down').click(function(event) {
    var selectedObj = canvas.getActiveObject();
    if (selectedObj == null) 
        return;
    
    if ($('#clipart_layer li:last-child').attr('data-id') == selectedObj.id)
        return;
    if (selectedObj) {
        selectedObj.sendToBack();
    }

    var id      = selectedObj.id;
    if(selectedObj.objType == "image")
    {
        var selLi   = $('#clipart_layer').find("[data-id='image_" + selectedObj.id + "']");    
    }
    else
    {
        var selLi   = $('#clipart_layer').find("[data-id='text_" + selectedObj.id + "']");       
    }
    var next    = selLi.next();
    next.after(selLi);
    canvas.renderAll();
});

$('.position_center').click(function(event) {
    var selectedObj = canvas.getActiveObject();
    if (selectedObj == null) 
        return;

    selectedObj.left = parseInt(canvas.getWidth() / 2, 10);
    canvas.renderAll();
    canvas.setActiveObject(selectedObj);
});


$('#lock').click( function(event) {
    if ($(this).attr('data-lock') == 'false') {
        $(this).attr('data-lock', 'true');
        $(this).css('background-position', '0 -3600px');
    } else {
        $(this).attr('data-lock', 'false');
        $(this).css('background-position', '0 -3650px');
    }
});

$('body').on('click', '#clipart_layer li', function(e) {
  
    var data_id = $(this).attr('data-id');
    var res = data_id.split("_");
    var type = res[0];
    var id = res[1];
    $('#clipart_layer').find('li.active').removeClass('active');
    $('#clipart_layer').find("[data-id='" + data_id + "']").addClass('active');
    for (var i = 0; i < canvas.getObjects().length; i ++) {
        if (canvas.item(i).id == id && canvas.item(i).objType == type) {
            canvas.setActiveObject(canvas.item(i));
            product.setSelectObj(canvas.item(i));
            return;        
        }
    }

});
var newplacement = null;
$('.placement-modal .modal-body').on('click', 'div',function () {
    // var placement_list = [];
    // if(product.Designs.placement.length>0)
    // {
        
    // }
    // else{

    // }
    console.log(product.Designs.placement);
    $('.placement-modal .modal-body').find('.active').removeClass('active');
    $(this).addClass('active');
    newplacement = $(this);

})

$('#select_placement').click(function(event) {
    var click_product = {
        ID : newplacement.children('img').attr('data-id'),
        Name : newplacement.children('img').attr('data-name'),
        Overlap : newplacement.children('img').attr('data-overlap'),
        Width : newplacement.children('img').attr('data-width'),
        Height : newplacement.children('img').attr('data-height'),
        PreviewImage : newplacement.children('img').attr('src')
    }
    product.Designs.placement.push(click_product);
    $('#placement').attr('src', newplacement.children('img').attr('src'));
    $('.placement-modal .close').click();
    drawGrayGrid(newplacement.children('img').attr('data-width'),newplacement.children('img').attr('data-height'));
});

function updateControls() {
    var selectedObj = canvas.getActiveObject();
    if (selectedObj == null) 
        return;

	if(selectedObj.objType == "image")
    {
        $('#clipart_width_text, #clipart_width_range').val(selectedObj.getWidth());
        $('#clipart_height_text, #clipart_height_range').val(selectedObj.getHeight());
        $('#clipart_angle_text, #clipart_angle_range').val(selectedObj.getAngle());       
    }
    else
    {
        $('#clipart_stretch_text, #clipart_stretch_range').val(selectedObj.getWidth());
        $('#clipart_lnheight_text, #clipart_lnheight_range').val(selectedObj.getHeight());
        $('#clipart_rotate_text, #clipart_rotate_range').val(selectedObj.getAngle());    
    }
    // ratio = selectedObj.getWidth() / selectedObj.getHeight();
}

// Handle canvas event
canvas.on({
    'object:modified':      checkText,
    'object:resizing':      updateControls,
    'object:rotating':      updateControls,
    'object:scaling':       updateControls,
    'object:removed':       updatelayersection,
    'selection:cleared':    removeEditPanel,  
    'object:moving':        grayCanvasBound,       
    "mouse:down":   function (e) {
                        var selectedObj = canvas.getActiveObject();
                        if (selectedObj == null) 
                        return; 
                        activeObj = selectedObj;      
                        product.setSelectObj(selectedObj);
                    },
    "mouse:move":   function(e){

    }
});
function grayCanvasBound(){
    var selectedObj = canvas.getActiveObject();
    lpos = selectedObj.getBoundingRect().left;
    tpos = selectedObj.getBoundingRect().top;
    gwidth = selectedObj.getBoundingRect().width;
    gheight = selectedObj.getBoundingRect().height;
    // graytlx = gridlp;
    // graytly = gridtp;
    // graywidth = w;
    // grayheight = h;
   // if((graytlx>lpos && graytly<tpos) || (graytlx+graywidth>lpos+gwidth && graytly+grayheight<tpos+gheight) || )
    //if(selectedObj)
}


function checkText(e) {

    var b = e.target;
    var c = this;
    var selectedObj = canvas.getActiveObject();
    var ratio = selectedObj.getWidth()/selectedObj.getHeight();
    var selectedObjId = selectedObj.id;
    
    if(selectedObj.objType == "image")
    {
        var cid = 'image_' + selectedObjId;
    }
    else{
        var cid = 'text_' + selectedObjId;
    }
    var angle = selectedObj.getAngle();
    if(ratio>1)
    {
        $('#'+cid).css('transform','rotate('+angle+'deg) scale(1,'+1/ratio+')');
    }
    else{
        $('#'+cid).css('transform','rotate('+angle+'deg) scale('+ratio+',1)');
    }   

}

function updatelayersection() {
    if ( ! isSelectedColor) {
        $('.colortab_custom').hide();

        if (activeObj.objType == 'image') {
            $('#clipart_layer').find("[data-id='image_" + activeObj.id + "']").remove();   
        } else {
            $('#clipart_layer').find("[data-id='text_" + activeObj.id + "']").remove();
        } 
        
        removeobj = 1;
     //   console.log(isSelectedColor);
    }

    isSelectedColor = false;
}

function removeEditPanel() {

    if ( ! isSelectedColor) {
        $(".colortab_custom").hide();    
    }
}
$('#addText').click(function(){
    $('#tbxbefore').val('');
    $('.colortab_custom').show();
    $('.edittextbox').show();
    $('.cliparteditor').hide();
    $('.texteditor').hide();
})
$('#gotext').click(function(){
    $('.edittextbox').hide();
    $('#tbx').val($('#tbxbefore').val());
    $('.texteditor').show();
    drawCharacters($('#dlFonts_form').val(), $('#tbx'), $('#myCanvas').width() / 2, $('#myCanvas').height() / 2,$("#fillcolor").css("background-color"),$("#strokecolor").css("background-color"),1);
    
    $('cliparteditor').hide();
});
var p_flag = 0;
var isaddtext = 0;
$(document).ready(function() {
    
    $('#placement').click();
    $('.secondp').hide();
    $(".tabcontent").children().hide();
    $(".tabcontent").children().first().show();
    $('.colortab_custom').hide();

    p_flag = 0;
    isaddtext = 0;
    $('.tab_custom').height($('.colortab_custom').height());
    var acc = document.getElementsByClassName("accordion");
    acc[0].classList.toggle("active");
    acc[0].nextElementSibling.classList.toggle("show");
});

// $('.accordion').click(function(e){
//     $('.tab_custom').height($('.colortab_custom').height());
// });
$('body').on('click','#listClipArt li',function(event) { 
    //console.log($(this).html());
    drawClipArt($(this).attr('id'), $('#myCanvas').width() / 2, $('#myCanvas').height() / 2,1);
});
$('#dlFonts_form').change(function(){
        //   drawCharacters($('#dlFonts_form').val(), $('#tbx'), $('#myCanvas').width() / 2, $('#myCanvas').height() / 2);        
    if(canvas.getActiveObject().objType == "text")
    {
        //drawCharacters($('#dlFonts_form').val(), $('#tbx'), $('#myCanvas').width() / 2, $('#myCanvas').height() / 2);   
        updateCharacters($('#dlFonts_form').val(), $('#tbx'), $('#myCanvas').width() / 2, $('#myCanvas').height() / 2);
    }
});

$('body').on('click','.colorpicker',function(e) {
    $('.firstp').hide();
    $('.secondp').show();
    $('.tab_custom').css("height", $('.colortab_custom').css("height"));
});

$('body').on('click','.closebtn',function(e) {
    $('.secondp').hide();
    $('.firstp').show();
});
var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
    acc[i].onmousedown = function() {
        $('.tab_custom').height();
        $('.secondp').find('.accordion').removeClass('active');
        $('.secondp').find('.panel').removeClass('show');
        this.classList.toggle("active");
        
        this.nextElementSibling.classList.toggle("show");
    }
}
