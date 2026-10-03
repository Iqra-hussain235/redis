import express from 'express';
import Redis from 'ioredis';

const app = express();
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

app.use(express.json());

app.post('/user/:id/json',async(req,res)=>{
    await redis.set(`user:${req.params.id}:json`,JSON.stringify(req.body));
    res.json({savedAs:"json"});
})

app.get('/user/:id/json',async(req,res)=>{
    const raw=await redis.get(`user:${req.params.id}:json`);
    res.json({user:raw ? JSON.parse(raw) : null});
});

app.post('/user/:id/hash',async(req,res)=>{
    await redis.hset(`user:${req.params.id}:hash`,req.body);
    res.json({savedAs:"hash"});
})

app.get(`/user/:id/hash`,async(req,res)=>{
    const raw=await redis.hgetall(`user:${req.params.id}:hash`);
    res.json({user:raw});
}); 

app.listen(process.env.PORT || 3000,()=>{
    console.log('Server is running on port 3000');
});