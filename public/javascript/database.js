//const con = require('/model/user');




// async function insert() {
   
//         const settings = {
//             host     : 'localhost',
//             user     : 'root',
//             password : '',
//             database : 'livebuddy'
//         };
//         const pool = new QueryBuilder(settings, 'mysql', 'pool');
    
//     try {
//         const qb = await pool.get_connection();
//         // const response = await qb.select('name', 'position')
//         //     .where({type: 'rocky', 'diameter <': 12000})
//         //     .get('planets');

//         const response = await qb.get('email')

//         // SELECT `name`, `position` FROM `planets` WHERE `type` = 'rocky' AND `diameter` < 12000
//         console.log("Query Ran: " + qb.last_query());

//         // [{name: 'Mercury', position: 1}, {name: 'Mars', position: 4}]
//         console.log("Results:", response);
//     } catch (error) {
//         console.log(error)
//     }
    
// }

