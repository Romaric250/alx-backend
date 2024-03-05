import {createClient} from "redis"

const client = createClient();

client.on("connect", () => {
    console.log("Redis client connected to the server");
}).on("error", (error) => {
    console.log(`Redis client not connected to the server: ${error.message}`);
});

const set = promisify(client.set).bind(client);

const SetNewSchool = (schoolName, value) => {
    client.set(schoolName, value, (error, resp) => {
        if (error) {
            console.log(error);
            throw error;
        }
        console.log(resp);
    });
}

const displaySchoolValue = async (schoolName) => {
    const response = await client.get(schoolName).catch((error) =>{
        if (error) {
            console.log(error);
            throw error;
        }
    });
    console.log(response);
}

displaySchoolValue("Holberton");
setNewSchool("HolbertonSanFrancisco", "100");
displaySchoolValue("HolbertonSanFrancisco");

