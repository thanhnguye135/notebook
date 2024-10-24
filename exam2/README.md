<!-- Containers have networking enabled by default, and they can make outgoing connections. A container has no information about what kind of network it's attached to, or whether their peers are also Docker workloads or not. A container only sees a network interface with an IP address, a gateway, a routing table, DNS services, and other networking details. That is, unless the container uses the none network driver.

bridge The default network driver.

By default, when you create or run a container using docker create or docker run, containers on bridge networks don't expose any ports to the outside world.

Publishing container ports is insecure by default. Meaning, when you publish a container's ports it becomes available not only to the Docker host, but to the outside world as well.

If you want to make a container accessible to other containers, it isn't necessary to publish the container's ports. You can enable inter-container communication by connecting the containers to the same network, usually a bridge network.

By default, the container gets an IP address for every Docker network it attaches to. A container receives an IP address out of the IP subnet of the network. The Docker daemon performs dynamic subnetting and IP address allocation for containers.

In the same way, a container's hostname defaults to be the container's ID in Docker. You can override the hostname using --hostname. When connecting to an existing network using docker network connect, you can use the --alias flag to specify an additional network alias for the container on that network.

Containers use the same DNS servers as the host by default

By default, containers inherit the DNS settings as defined in the /etc/resolv.conf configuration file. Containers that attach to the default bridge network receive a copy of this file. Containers that attach to a custom network use Docker's embedded DNS server.

The embedded DNS server forwards external DNS lookups to the DNS servers configured on the host.

By default, for both IPv4 and IPv6, the daemon blocks access to ports that have not been published. Published container ports are mapped to host IP addresses.

In terms of Docker, a bridge network uses a software bridge which lets containers connected to the same bridge network communicate, while providing isolation from containers that aren't connected to that bridge network.

Bridge networks apply to containers running on the same Docker daemon host.

For communication among containers running on different Docker daemon hosts, you can either manage routing at the OS level, or you can use an overlay network.

When you start Docker, a default bridge network (also called bridge) is created automatically, and newly-started containers connect to it unless otherwise specified.

User-defined bridges provide automatic DNS resolution between containers.

Containers on the default bridge network can only access each other by IP addresses, unless you use the --link option, which is considered legacy. On a user-defined bridge network, containers can resolve each other by name or alias. -->

<!-- Containers connected to the same user-defined bridge network effectively expose all ports to each other. For a port to be accessible to containers or non-Docker hosts on different networks, that port must be published using the -p or --publish flag. -->
<!-- ## DNS trong Docker

Docker sử dụng DNS internal server cho các container kết nối vào cùng một mạng user-defined (bridge). Docker tự động tạo các mục DNS để cho phép chúng giao tiếp với nhau bằng tên service. DNS internal server này mapping tên container đến địa chỉ IP tương ứng, => không cần sử dụng địa chỉ IP.

### Cách hoạt động của DNS trong Docker

1. **User-defined**: Trong một mạng bridge, các container được tách biệt với các container trong các mạng khác. Docker engine chạy một DNS internal server để mapping tên container đến các địa chỉ IP. Khi một container cố gắng truy cập một container khác bằng tên service của nó, DNS server resolve tên container => địa chỉ IP.
2. **Bridge Networks**: Mạng bridge là mạng mặc định được Docker tạo ra. Khi các container được kết nối vào một mạng user-defined, Docker sẽ tự động quản lý các địa chỉ IP và các mục DNS.

### Đặc điểm của mạng Bridge:

- **Địa chỉ IP của Container**: Mỗi container trong một mạng bridge đều được cấp phát một địa chỉ IP nội bộ.
- **Seperate network**: Các container trên mạng bridge không thể giao tiếp với các container trên các mạng khác.

### Resolution Service name trong Docker Compose

Khi sử dụng Docker Compose, các container có thể giao tiếp với nhau bằng tên service như các mục DNS. Docker Compose tự động thiết lập việc resolution DNS, mapping tên service đến các địa chỉ IP của container.

### Tại sao Service name hoạt động được

Khi tất cả các service được định nghĩa trong cùng một file Docker Compose và được kết nối vào một mạng chung, Docker quản lý các mục DNS cho mỗi service. Các mục DNS này mapping tên service đến các địa chỉ IP của container tương ứng.

### Tại sao cấu hình có thể khác nhau dối với một số Service

1. **Sử dụng địa chỉ IP**: Trong các trường hợp mà các container nằm trên các mạng riêng biệt, resolution internal DNS không hỗ trợ giao tiếp giữa các mạng đó. Do đó, các container cần được truy cập bằng địa chỉ IP cụ thể của chúng.
2. **Sử dụng tên service**: Khi các container nằm trong cùng một file Docker Compose và được kết nối vào một mạng chung, Docker sẽ tự động resolution tên container thành các địa chỉ IP nội bộ. -->

![DNS](image-1.png)

![DNS resolution](image-2.png)

### Tại sao trong cùng một docker compose file các container có thể communicate via service name

- Docker sử dụng built-in DNS service: DNS service maps IP address => aliases
- Đầu tiên Docker gán IP cho mỗi container như DHCP server
- Containers process DNS requests via docker daemon, dockerd sẽ nhận ra container name on the same internal network => communicate without internal IP address.
- DNS resolution is process: domain name => IP address

### Tại sao khi các container on the different network muốn communicate via IP address + host's port

- Do các container hoàn toàn tách biệt không cùng một DNS server => không thể resolve container name
- Sử dụng cơ chế NAT và port forwarding : `<IP-host>`:port-mapping ~ `<IP-container>`:port-expose

### Tại sao phải expose port

- Việc expose port là cần thiết khi muốn cho phép các container bên ngoài truy cập vào dịch vụ của container thông qua host's port.
- Nếu chỉ giao tiếp giữa các container trong cùng một mạng, không cần phải expose ports.
