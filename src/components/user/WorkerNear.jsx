import React, { useEffect, useState } from 'react';
import WorkerCard from './WorkerCard';
import instance from '../../helper/axiosInstance';
import isWithin from '../../helper/isWithIn';
import WorkerCard2 from './WorkerCard2';
import ProfileCard from './WorkerProfile3';
import { useNavigate } from 'react-router-dom';

function WorkerNear({ location }) {
  const [workers, setWorkers] = useState([]);

  useEffect(() => {
    getAllWorkers();
  }, [location]); // Add location as a dependency

  const nav = useNavigate()

  async function getAllWorkers() {
    try {
      let res = await instance.get('/workers');
      let list = res.data.list;
      let ApprovedWorkers = list.filter((worker) => worker.active);
      let workersWithInRange = [];
      for (let worker of ApprovedWorkers) {
        let res = isWithin(location.lat, location.long, worker.lat, worker.long);
        console.log('res from for of = ', res)
        if (res) {
          workersWithInRange.push(worker);
        }
      }
      console.log('with in range = ', workersWithInRange)
      setWorkers([...workersWithInRange]); // Set the state with filtered workers
    } catch (error) {
      console.error('Error fetching workers:', error);
    }
  }
    
  async function selectedWorker(_id){
    console.log('Working.....');
    
    console.log('working id == ',_id)
    nav(`/user/WorkerDetails/${_id}/WorkerServices`)
  }


  return (
    <div className="text-center p-5 flex-col">
      <h1 className="text-3xl underline mb-5">Workers Near You</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {workers.map((worker, index) =>
            <ProfileCard key={worker._id} worker={worker} workerIdPass={selectedWorker} />
        )}
      </div>
    </div>
  );
}

export default WorkerNear;
