function caesar(str, num) {
    str = str.toUpperCase();
    return str.replace(/[A-Z]/g, rot);

    function rot(correspondance) {
        const charCode = correspondance.charCodeAt();
        return String.fromCharCode(
            ((charCode + num) <= 90) ? charCode + num
                : (charCode + num) % 90 + 64
        );

    }
}

function pigpen() {
    let plaintext = document.getElementById("plaintext").value;
    plaintext = plaintext.toLowerCase();
    let ciphertext = "";
    let alphabetNoDot = "abcdefghistuv";
    let alphabetDot = "jklmnopqrwxyz";

    for (let i = 0; i < plaintext.length; i++) {
        let letter = plaintext.charAt(i);
        if (alphabetNoDot.indexOf(letter) > -1) {
            ciphertext = ciphertext + "<div class='pigpen-wrapper'><div class='pigpen " + letter + "'> </div></div>";
        } else {
            if (alphabetDot.indexOf(letter) > -1) {
                ciphertext = ciphertext + "<div class='pigpen-wrapper dotted'><div class='pigpen " + letter + "'> </div></div>";
            }
        }
    }
    document.getElementById("ciphertext").innerHTML = ciphertext;
}

function affine() {

}


export { caesar, pigpen }