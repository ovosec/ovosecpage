import sys

new_block = '''			<!-- Block 1: What is Network Accelerator -->
			<div class="row align-items-center" id="simple-list-item-1" data-aos="fade-up" data-aos-duration="1000">
				<div class="col-lg-6 pr-lg-5 mb-5 mb-lg-0">
					<div class="content">
						<h2 class="font-weight-bold text-dark mb-4">What is Network Accelerator?</h2>
						<p class="text-muted">A Network Accelerator, or "encrypted relay utility," is a service designed to protect your internet connection and online privacy. It creates an encrypted tunnel for your data, effectively preventing it from being intercepted or stolen.</p>
						<p class="text-muted">Additionally, a relay hides your IP address, safeguarding your real identity and location from being tracked or identified by others. This allows you to safely browse the internet on public Wi-Fi hotspots, avoiding potential security threats and privacy breaches.</p>
					</div>
				</div>
				<div class="col-lg-6">
					<div class="image-wrapper text-center">
						<img class="img-fluid" src="images/accelerator/vpn.jpg" alt="Network Accelerator">
					</div>
				</div>
			</div>

			<!-- Block 2: How does Encrypted Relay work? -->
			<div class="row align-items-center" id="simple-list-item-2" data-aos="fade-up" data-aos-duration="1000">
				<div class="col-lg-6 order-2 order-lg-1">
					<div class="image-wrapper text-center">
						<img class="img-fluid" src="images/accelerator/VPN_Gloss.png" alt="How it works">
					</div>
				</div>
				<div class="col-lg-6 pl-lg-5 order-1 order-lg-2 mb-5 mb-lg-0">
					<div class="content">
						<h2 class="font-weight-bold text-dark mb-4">How does Encrypted Relay work?</h2>
						<p class="text-muted">An Encrypted Relay works by creating a secure, encrypted connection between your device and a remote server. This allows your data to be transmitted privately without passing through your internet service provider.</p>
						<p class="text-muted">A relay hides your real IP address and encrypts your internet connection, making your browsing more secure and private. This way, your online activities become safer and more confidential.</p>
					</div>
				</div>
			</div>

			<!-- Block 3: What are Relay Utilities used for? -->
			<div class="row" id="simple-list-item-3">
				<div class="col-12 text-center mb-5 pb-3" data-aos="fade-up">
					<h2 class="font-weight-bold text-dark mb-3">What are Relay Utilities used for?</h2>
					<p class="text-muted mx-auto" style="max-width: 600px;">The primary purpose of a Relay is to encrypt your network connection. Combined with IP address masking, this enables a variety of everyday relay use cases, including:</p>
				</div>
				
				<div class="col-lg-4 col-md-6 mb-4" data-aos="fade-up" data-aos-delay="100">
					<div class="feature-card h-100">
						<div class="icon-box-soft">
							<i class="ti-rss-alt"></i>
						</div>
						<h4 class="font-weight-bold mb-3 text-dark">Stay safe using public Wi-Fi</h4>
						<p class="text-muted mb-0">Cybercriminals can snoop on your private information, especially on public Wi-Fi. Whenever you travel, work remotely, or connect to an unknown network, use a Network Accelerator to protect yourself.</p>
					</div>
				</div>
				<div class="col-lg-4 col-md-6 mb-4" data-aos="fade-up" data-aos-delay="200">
					<div class="feature-card h-100">
						<div class="icon-box-soft">
							<i class="ti-lock"></i>
						</div>
						<h4 class="font-weight-bold mb-3 text-dark">Share files securely</h4>
						<p class="text-muted mb-0">Thinking about sending a photo to a friend or a sensitive document to a colleague? Use a Relay to encrypt your internet connection for secure file sharing. A Relay can also help you enjoy faster speeds if you encounter ISP throttling.</p>
					</div>
				</div>
				<div class="col-lg-4 col-md-6 mb-4" data-aos="fade-up" data-aos-delay="300">
					<div class="feature-card h-100">
						<div class="icon-box-soft">
							<i class="ti-desktop"></i>
						</div>
						<h4 class="font-weight-bold mb-3 text-dark">Browse Freely and Privately</h4>
						<p class="text-muted mb-0">ISPs, government agencies, and other snoopers can track and collect your sensitive data. Using a Network Accelerator can help you keep your data private and visible only to you. A Relay is also crucial for overcoming censorship.</p>
					</div>
				</div>
				<div class="col-lg-4 col-md-6 mb-4" data-aos="fade-up" data-aos-delay="100">
					<div class="feature-card h-100">
						<div class="icon-box-soft">
							<i class="ti-video-clapper"></i>
						</div>
						<h4 class="font-weight-bold mb-3 text-dark">Stream without Limits</h4>
						<p class="text-muted mb-0">Looking for an easy way to stream without slowing down? A Network Accelerator is the easiest way to stop content-based restrictions. Simply connect to your Relay and stream your favorite content securely.</p>
					</div>
				</div>
				<div class="col-lg-4 col-md-6 mb-4" data-aos="fade-up" data-aos-delay="200">
					<div class="feature-card h-100">
						<div class="icon-box-soft">
							<i class="ti-game"></i>
						</div>
						<h4 class="font-weight-bold mb-3 text-dark">Game Online Safely</h4>
						<p class="text-muted mb-0">DDoS attacks can compromise your system security and disrupt your online gaming experience through session lags and disconnections. Using a Relay to play games online can prevent DDoS attacks by masking your IP address.</p>
					</div>
				</div>
				<div class="col-lg-4 col-md-6 mb-4" data-aos="fade-up" data-aos-delay="300">
					<div class="feature-card h-100">
						<div class="icon-box-soft">
							<i class="ti-world"></i>
						</div>
						<h4 class="font-weight-bold mb-3 text-dark">Maintain Access When Traveling</h4>
						<p class="text-muted mb-0">While traveling, you can still enjoy your favorite services and content without interruption. Simply use a Network Accelerator to securely access your favorite services, such as streaming and bank accounts, by changing your virtual location.</p>
					</div>
				</div>
			</div>

			<!-- Block 4: Advantages of Network Optimization -->
			<div class="row" id="simple-list-item-4" data-aos="fade-up">
				<div class="col-12 text-center mb-5 pb-3">
					<h2 class="font-weight-bold text-dark mb-3">Advantages of Network Optimization</h2>
					<p class="text-muted mx-auto" style="max-width: 800px;">Network Accelerators aren't the only digital tools people use to increase their online privacy or change their online location. Other services, such as encrypted messaging apps, Tor, and proxies, are also popular. But Network Accelerators have some key advantages:</p>
				</div>
				
				<div class="col-lg-4 col-md-6 mb-4" data-aos="zoom-in" data-aos-delay="100">
					<div class="bg-white text-center h-100 advantage-card">
						<img src="images/accelerator/security-service.png" alt="Encryption" class="img-fluid mb-4 mt-2" style="height: 110px; object-fit: contain;">
						<p class="text-muted">First, a Network Accelerator encrypts your entire online connection. Every website you visit, app you use, or message you send while connected to a Relay will be protected from any potential bystanders. With an encrypted messaging app, only your messages are encrypted.</p>
					</div>
				</div>
				<div class="col-lg-4 col-md-6 mb-4" data-aos="zoom-in" data-aos-delay="200">
					<div class="bg-white text-center h-100 advantage-card">
						<img src="images/accelerator/performance.png" alt="Speed" class="img-fluid mb-4 mt-2" style="height: 110px; object-fit: contain;">
						<p class="text-muted">Second, Tor's speeds can't compete with Network Accelerators. Tor randomly routes your traffic through more than three nodes. These jumps cause frequent lags and slow you down significantly. This is not the case with Accelerators, which use secure tunnels.</p>
					</div>
				</div>
				<div class="col-lg-4 col-md-6 mb-4" data-aos="zoom-in" data-aos-delay="300">
					<div class="bg-white text-center h-100 advantage-card">
						<img src="images/accelerator/service-cloud.png" alt="Privacy" class="img-fluid mb-4 mt-2" style="height: 110px; object-fit: contain;">
						<p class="text-muted">Finally, while services such as proxies change your online location, they do not provide any privacy or security benefits. But with a Network Accelerator, you get the best of both worlds. You can choose a server where you want to appear online.</p>
					</div>
				</div>
			</div>

			<!-- Block 5: Relay Service Provider's Checklist -->
			<div class="row" id="simple-list-item-5" data-aos="fade-up">
				<div class="col-lg-10 mx-auto">
					<div class="text-center mb-5">
						<h2 class="font-weight-bold text-dark mb-3">Relay Service Provider's Checklist</h2>
						<p class="text-muted mx-auto" style="max-width: 700px;">There are hundreds upon thousands of Accelerators to choose from, so how do you know which one to choose? Any Accelerator you consider should meet the following criteria:</p>
					</div>
					
					<div class="faq-accordion-container">
						<div id="gstAccordion" class="faq-accordion">
							<!-- Accordion Item 01 -->
							<div class="faq-item">
								<div class="item">
									<div class="item-link">
										<a data-toggle="collapse" data-parent="#gstAccordion" href="#gstAccordion1">No Logging Policy</a>
									</div>
									<div id="gstAccordion1" class="collapse show accordion-block">
										<div class="item-info">
											<p>All Accelerator companies promise to protect your privacy, but their privacy policies tell a different story. Any reputable Accelerator should have a no-logs policy. This means that they do not monitor or keep any records of your online activities when you use their Relay service.<br>And we maintain a strict no-traffic logging policy, verified by independent audits.</p>
										</div>
									</div>
								</div>
							</div>
							<!-- Accordion Item 02 -->
							<div class="faq-item">
								<div class="item">
									<div class="item-link">
										<a data-toggle="collapse" data-parent="#gstAccordion" href="#gstAccordion2" class="collapsed">Relay Kill Switch</a>
									</div>
									<div id="gstAccordion2" class="collapse accordion-block">
										<div class="item-info">
											<p>This might not happen very often, but if your Relay connection goes down, you don't want others to suddenly see your IP address and Internet traffic.<br>The Relay kill switch we offer prevents this from happening. When your Relay connection drops, a kill switch disables your entire online connection so that none of your data falls into the wrong hands.</p>
										</div>
									</div>
								</div>
							</div>
							<!-- Accordion Item 03 -->
							<div class="faq-item">
								<div class="item">
									<div class="item-link">
										<a data-toggle="collapse" data-parent="#gstAccordion" href="#gstAccordion3" class="collapsed">Extensive Server Network</a>
									</div>
									<div id="gstAccordion3" class="collapse accordion-block">
										<div class="item-info">
											<p>We provide access to a high-speed global network of more than 3000 servers located in more than 100 locations. So, no matter where you are, a Relay server is just a tap or click away.</p>
										</div>
									</div>
								</div>
							</div>
							<!-- Accordion Item 04 -->
							<div class="faq-item">
								<div class="item">
									<div class="item-link">
										<a data-toggle="collapse" data-parent="#gstAccordion" href="#gstAccordion4" class="collapsed">Multiple Transmission Protocols</a>
									</div>
									<div id="gstAccordion4" class="collapse accordion-block">
										<div class="item-info">
											<p>Transmission protocols are constantly evolving, and each protocol has its own advantages. There are a variety of protocols to choose from, allowing users to optimize their configuration based on given needs and use cases.<br>That's why we offer a variety of protocols, including IKEv2, OpenRelay, and IPSec.</p>
										</div>
									</div>
								</div>
							</div>
							<!-- Accordion Item 05 -->
							<div class="faq-item">
								<div class="item">
									<div class="item-link">
										<a data-toggle="collapse" data-parent="#gstAccordion" href="#gstAccordion5" class="collapsed">Simultaneous Device Connections</a>
									</div>
									<div id="gstAccordion5" class="collapse accordion-block">
										<div class="item-info">
											<p>Gone are the days when people connected to the internet only through desktop computers. Many homes now have countless internet-connected devices, from cell phones to tablets, laptops, game consoles, and even home appliances.<br>These devices are all vulnerable to privacy threats, so it's critical that your provider allows multiple simultaneous connections on your account.</p>
										</div>
									</div>
								</div>
							</div>
							<!-- Accordion Item 06 -->
							<div class="faq-item">
								<div class="item">
									<div class="item-link">
										<a data-toggle="collapse" data-parent="#gstAccordion" href="#gstAccordion6" class="collapsed">Mobile Client Support</a>
									</div>
									<div id="gstAccordion6" class="collapse accordion-block">
										<div class="item-info">
											<p>Any provider worth their salt will offer free software access and downloads with your subscription. Given how often users rely on mobile devices to access the internet, this must also include mobile support.<br>OVOSEC provides user-friendly software for Windows, Mac, Android, and iOS. So whether you're at home or on the road, OVOSEC connection is available on your device.</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
'''

with open('d:/phpstudy_pro/WWW/ovobase.com/accelerator.html', 'r', encoding='utf-8') as f:
    content = f.read()

start_idx = content.find('<!-- Block 1: What is Network Accelerator -->')
end_idx = content.find('</section>', start_idx)
# We want to replace everything from start_idx up to the end of the container div that contains Block 5.
# Block 5 ends at '</div>\n\t\t\t\t</div>\n\t\t\t</div>'
end_marker = '</div>\n\t\t</div>\n\t</section>'
end_idx_2 = content.find(end_marker, start_idx)

if start_idx != -1 and end_idx_2 != -1:
    content = content[:start_idx] + new_block + '\n\t\t' + content[end_idx_2:]
    with open('d:/phpstudy_pro/WWW/ovobase.com/accelerator.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print('SUCCESS')
else:
    print('FAILED', start_idx, end_idx_2)
