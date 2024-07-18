$(function(){
    //mascara pagina cadastro
    $("#nome_coordenador").on('input', function(){
        const regra = /[^a-zA-Z\s]/g;
        if(this.value.match(regra)){
            $(this).val(this.value.replace(regra,''));
        }
    });
    $('#siape_coordenador').mask('0000000');
    $('#telefone_coordenador').mask('(00)90000-0000');
    
})