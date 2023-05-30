export default function getToken() {
    const cookie = document.cookie;
    const token = cookie.substring(8);
    console.log("cookie token", token);
    return token;
}
