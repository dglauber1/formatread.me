$('#in1').keyup(function(event) {
    if ($('#in1').val() == '') {
        $('#out1').html("");
        return;
    } else {
        $('#out1').html(reformatText($('#in1').val(), 80, true, true));
    }
});
