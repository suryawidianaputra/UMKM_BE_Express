let result = "";
const resource =
  "123456789-abcdefghijklmnopqrstuvwxyz-ABCDEFGHIJKLMNOPQRSTUVWXYZ";

for (let i = 0; i <= 1; i++) {
  result += resource[Math.floor(Math.random() * resource.length + 1)];
}

console.log(result);
