## Dockerizing ifs -process -manager
 Step 1: Create the Dockerfile 
  --- 
     command used: touch Dockerfile
   ---- 
 step 2: Build the docker image.
   ---
    command used: sudo docker build -t process_manager .
   ---
   step 3: Run the docker image.
   ----
    command used: sudo docker run -p 31701:31701 process_manager
     ---
     The above command starts the process manager image inside the container and exposes port 31701 inside container to port 31701 outside the container.
     ----

   step 4: Check the image created 
   ---
    command used: docker images
   ---
 step 5:Access the route on server using http://localhost:31701

