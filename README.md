<h2>
  This is full working freelancing website handling major features required for a freelancing platform, supported and prioritised by freelancers around the world 🌐
</h2>

<h3><b>
  Just clone this repo, follow these steps and start testing.🧑‍💻💻<br>
</b></h3>
<li><b>First cloning the repo</b></li>
<li><b>Create a .env file in back/ directory having the following content</b></li>
  <ul><li>PORT=4000<br>
MONGODB_URI=replace_with_your_mongodb-atlas_connection_string<br>
CLIENT_ORIGIN=http://localhost:5173<br>
JWT_SECRET=myjwtsecret<br></li></ul>
<li><b>Similarly create a .env file in front/ directory having the following content</b></li>
<ul><li>
VITE_CLOUDINARY_CLOUD_NAME=dgk....<br>
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload preset(in settings, allow pdf delivery)<br>
VITE_API_BASE_URL=http://localhost:4000</li></ul>

<li><b>then run these following commands</b></li>
<ol>
  <li><b>cd back</b> (change to back dir)</li>
  <li><b>npm i && npm run dev</b> (install dependencies and start server)</li>
  <li><b>cd ../front</b> (change to front dir)</li>
  <li><b>npm i && npm run dev</b> (install dependencies and start server)</li>
</ol>


<h3><b>
  And Boom!!💥<br>
  Freelancify is ready to roll.✅
</b></h3>
