import express from 'express';
import Redis from 'ioredis';

const app = express();
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

app.use(express.json());

const QUEUE_KEY = 'queue:email';

app.post('/emails',async(req,res)=>{
    const job = {
        to:req.body.to, 
        subject:req.body.subject||'No Subject',
        body:req.body.body||'No Content',
        createdAt:new Date().toISOString()
    }
    await redis.lpush(QUEUE_KEY, JSON.stringify(job))
    res.send({message:'email queued',job});
})

app.get('/emails/process-one',async (req,res)=>{
    const rawJob=await redis.rpop(QUEUE_KEY);
    if(!rawJob){
        return res.json({job:null})
    }
    const job=JSON.parse(rawJob);
    res.json({message:'email',job});
});

app.listen(process.env.PORT || 3000,()=>{
    console.log('Server is running on port 3000');
})