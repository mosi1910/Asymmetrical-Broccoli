from locust import HttpUser, TaskSet, task, between
from bs4 import BeautifulSoup


class UserBehavior(TaskSet):

    def on_start(self):
        self.login()

    def login(self):
        with self.client.get("/index.php?r=user%2Fauth%2Flogin", catch_response=True) as response:
            if response.status_code == 200:
                csrf_token = self.extract_csrf_token(response.text)
                with self.client.post("/index.php?r=user%2Fauth%2Flogin", data={
                    "_csrf": csrf_token,
                    "Login[username]": "admin",
                    "Login[password]": "Mosi1910",
                    "Login[rememberMe]": "1"
                }, catch_response=True) as login_response:
                    if "Logout" in login_response.text:
                        login_response.success()
                        print("Login successful")
                    else:
                        login_response.failure("Login failed")
                        print("Login failed")
            else:
                response.failure(f"Failed to load login page. Status code: {response.status_code}")

    def extract_csrf_token(self, html_content):
        soup = BeautifulSoup(html_content, 'html.parser')
        csrf_token = soup.find('input', {'name': '_csrf'})['value']
        return csrf_token

    @task(5)
    def go_to_dashboard(self):
        with self.client.get("/index.php?r=dashboard%2Fdashboard", catch_response=True) as response:
            if response.status_code == 200:
                response.success()
                print("Navigated to dashboard successfully")
            else:
                response.failure(f"Failed to navigate to dashboard. Status code: {response.status_code}")
                print(f"Failed to navigate to dashboard. Status code: {response.status_code}")

    @task(3)
    def follow_user(self):
        with self.client.get("/index.php?r=user%2Fpeople", catch_response=True) as people_response:
            if people_response.status_code == 200:
                people_response.success()
                print("Navigated to people tab successfully")

                profile_url = "/index.php?r=user%2Fprofile&cguid=cf0207ec-5178-46f1-952f-030265911a87"
                with self.client.get(profile_url, catch_response=True) as profile_response:
                    if profile_response.status_code == 200:
                        profile_response.success()
                        print("Navigated to user profile successfully")

                        csrf_token = self.extract_csrf_token(profile_response.text)
                        follow_url = "/index.php?r=user%2Fprofile%2Ffollow&cguid=cf0207ec-5178-46f1-952f-030265911a87"
                        with self.client.post(follow_url, data={"_csrf": csrf_token}, catch_response=True) as follow_response:
                            if follow_response.status_code == 200:
                                follow_response.success()
                                print("Followed user successfully")
                            else:
                                follow_response.failure(f"Failed to follow user. Status code: {follow_response.status_code}")
                                print(f"Failed to follow user. Status code: {follow_response.status_code}")
                                print(f"Response content: {follow_response.content}")
                    else:
                        profile_response.failure(f"Failed to load user profile. Status code: {profile_response.status_code}")
                        print(f"Failed to load user profile. Status code: {profile_response.status_code}")
            else:
                people_response.failure(f"Failed to navigate to people tab. Status code: {people_response.status_code}")
                print(f"Failed to navigate to people tab. Status code: {people_response.status_code}")

    @task(2)
    def create_new_post(self):
        # Step 1: Go to the space directory
        with self.client.get("/index.php?r=space%2Fspaces", catch_response=True) as space_response:
            if space_response.status_code == 200:
                space_response.success()
                print("Navigated to space directory successfully")

                # Step 2: Navigate to a specific space
                space_url = "/index.php?r=space%2Fspace&cguid=31814e33-2f3f-489c-873a-ba9512943fff"
                with self.client.get(space_url, catch_response=True) as specific_space_response:
                    if specific_space_response.status_code == 200:
                        specific_space_response.success()
                        print("Navigated to specific space successfully")

                        csrf_token = self.extract_csrf_token(specific_space_response.text)

                        # Step 3: Create a new post
                        post_url = "/index.php?r=post%2Fpost%2Fpost&cguid=31814e33-2f3f-489c-873a-ba9512943fff"
                        post_data = {
                            "_csrf": csrf_token,
                            "Post[message]": "This is a test post"
                        }
                        with self.client.post(post_url, data=post_data, catch_response=True) as post_response:
                            if post_response.status_code == 200:
                                post_response.success()
                                print("Post created successfully")
                            else:
                                post_response.failure(f"Failed to create post. Status code: {post_response.status_code}")
                                print(f"Failed to create post. Status code: {post_response.status_code}")
                                print(f"Response content: {post_response.content}")
                    else:
                        specific_space_response.failure(f"Failed to navigate to specific space. Status code: {specific_space_response.status_code}")
                        print(f"Failed to navigate to specific space. Status code: {specific_space_response.status_code}")
            else:
                space_response.failure(f"Failed to navigate to space directory. Status code: {space_response.status_code}")
                print(f"Failed to navigate to space directory. Status code: {space_response.status_code}")

    @task(1)
    def post_comment(self):
        # Step 1: Navigate to the specific space
        space_url = "/index.php?r=space%2Fspace&cguid=31814e33-2f3f-489c-873a-ba9512943fff"
        with self.client.get(space_url, catch_response=True) as space_response:
            if space_response.status_code == 200:
                space_response.success()
                print("Navigated to specific space successfully")

                # Step 2: Locate the post and its comment form
                soup = BeautifulSoup(space_response.text, 'html.parser')
                post_div = soup.find('div', {'id': 'h667966w6'})
                if post_div:
                    csrf_token = self.extract_csrf_token(space_response.text)

                    # Replace object_model with your actual model and object_id with "718"
                    object_model = 'humhub\\modules\\post\\models\\Post'  # Adjust based on your application
                    object_id = "718"  # This is the specific data-content-key value

                    # Step 3: Submit a comment to the post
                    comment_url = "/index.php?r=comment%2Fcomment%2Fpost"
                    comment_data = {
                        "_csrf": csrf_token,
                        "objectModel": object_model,
                        "objectId": object_id,
                        "message": "This is an automated comment from Locust."
                    }
                    with self.client.post(comment_url, data=comment_data, catch_response=True) as comment_response:
                        if comment_response.status_code == 200:
                            comment_response.success()
                            print("Comment posted successfully")
                        else:
                            comment_response.failure(
                                f"Failed to post comment. Status code: {comment_response.status_code}")
                            print(f"Failed to post comment. Status code: {comment_response.status_code}")
                            print(f"Response content: {comment_response.content}")
                else:
                    space_response.failure("Failed to find the post div.")
                    print("Failed to find the post div.")
            else:
                space_response.failure(
                    f"Failed to navigate to specific space. Status code: {space_response.status_code}")
                print(f"Failed to navigate to specific space. Status code: {space_response.status_code}")

    @task(2)
    def update_profile_address(self):
        with self.client.get("/index.php?r=user%2Faccount%2Fedit", catch_response=True) as response:
            if response.status_code == 200:
                response.success()
                print("Navigated to profile edit page successfully")

                soup = BeautifulSoup(response.text, 'html.parser')
                csrf_token = self.extract_csrf_token(response.text)

                street_input = soup.find('input', {'id': 'profile-street'})
                if street_input:
                    street_data = {
                        "_csrf": csrf_token,
                        "Profile[street]": "Sample Address"
                    }

                    save_button = soup.find('button', {'name': 'save'})
                    if save_button:
                        save_url = save_button.get('formaction') if save_button.has_attr('formaction') else response.url

                        with self.client.post(save_url, data=street_data, catch_response=True) as save_response:
                            if save_response.status_code == 200:
                                save_response.success()
                                print("Profile updated successfully")
                            else:
                                save_response.failure(
                                    f"Failed to save profile. Status code: {save_response.status_code}")
                                print(f"Failed to save profile. Status code: {save_response.status_code}")
                                print(f"Response content: {save_response.content}")
                    else:
                        response.failure("Save button not found.")
                        print("Save button not found.")
                else:
                    response.failure("Street input field not found.")
                    print("Street input field not found.")
            else:
                response.failure(f"Failed to navigate to profile edit page. Status code: {response.status_code}")
                print(f"Failed to navigate to profile edit page. Status code: {response.status_code}")

    @task(3)
    def view_poll_voters(self):
        # Step 1: Navigate to the specific space
        space_url = "/index.php?r=space%2Fspace&contentId=12&commentId=4&cguid=31814e33-2f3f-489c-873a-ba9512943fff"
        with self.client.get(space_url, catch_response=True) as space_response:
            if space_response.status_code == 200:
                space_response.success()
                print("Navigated to specific space successfully")

                # Step 2: View the voters of a poll
                poll_url = "/index.php?r=polls%2Fpoll%2Fuser-list-results&pollId=1&answerId=2&cguid=31814e33-2f3f-489c-873a-ba9512943fff"
                with self.client.get(poll_url, catch_response=True) as poll_response:
                    if poll_response.status_code == 200:
                        poll_response.success()
                        print("Viewed poll voters successfully")
                    else:
                        poll_response.failure(f"Failed to view poll voters. Status code: {poll_response.status_code}")
                        print(f"Failed to view poll voters. Status code: {poll_response.status_code}")
            else:
                space_response.failure(
                    f"Failed to navigate to specific space. Status code: {space_response.status_code}")
                print(f"Failed to navigate to specific space. Status code: {space_response.status_code}")

    @task(4)
    def logout(self):
        # Step 1: Click on the profile dropdown
        with self.client.get("/", catch_response=True) as response:
            if response.status_code == 200:
                soup = BeautifulSoup(response.text, 'html.parser')
                account_dropdown_link = soup.find('a', {'id': 'account-dropdown-link'})
                if account_dropdown_link:
                    # Step 2: Click on the logout link
                    csrf_token = self.extract_csrf_token(response.text)
                    with self.client.post("/index.php?r=user%2Fauth%2Flogout", data={
                        "_csrf": csrf_token
                    }, catch_response=True) as logout_response:
                        if logout_response.status_code == 200:
                            logout_response.success()
                            print("Logged out successfully")
                        else:
                            logout_response.failure(f"Failed to log out. Status code: {logout_response.status_code}")
                            print(f"Failed to log out. Status code: {logout_response.status_code}")
                else:
                    response.failure("Profile dropdown not found.")
                    print("Profile dropdown not found.")
            else:
                response.failure(f"Failed to load page. Status code: {response.status_code}")



class WebsiteUser(HttpUser):
    tasks = [UserBehavior]
    wait_time = between(1, 2)

# from locust import HttpUser, between, task
#
#
# class FlowException(Exception):
#     pass
#
#
# class QuickstartUser(HttpUser):
#     wait_time = between(1, 3)
#
#     @task(1)
#     def dashboard(self):
#         self.client.get("/")
#
#     @task(2)
#     def new_post(self):
#         self.client.get("/index.php?r=space%\2Fspace&cguid=31814e33-2f3f-489c-873a-ba9512943fff")
#         post_response = self.client.post("/index.php?r=space%\2Fspace&cguid=31814e33-2f3f-489c-873a-ba9512943fff", json={'id': 1, 'containerClass': 'new post'})
#         if post_response.status_code != 200:
#             raise FlowException("Post was not created :(")
#
#     @task(2)
#     def like_post(self):
#         post_response = self.client.post("/index.php?r=like%\2Flike%\2Flike&contentModel=humhum%5Cmodules%5Cpost%contentId=3")
#         if post_response.status_code != 200:
#             raise FlowException("Post was not liked :(")
#
#     @task(1)
#     def follow_user(self):
#         self.client.get("/index.php?r=user%\2Fpeople")
#         self.client.get("/index.php?r=user%\2Fprofile&cguid=cf0207ec-5178-46f1-952f-030265911a87")
#         post_response = self.client.post("/index.php?r=user%\2Fprofile%\2Ffollow&cguid=cf0207ec-5178-46f1-952f-030265911a87")
#         if post_response.status_code != 200:
#             raise FlowException("User was not followed :(")
#
#     @task(3)
#     def leave_comment(self):
#         self.client.get("/index.php?r=space%\2Fspace&cguid=31814e33-2f3f-489c-873a-ba9512943fff")
#         post_response = self.client.post(f'/index.php?r=comment%2Fcomment%2Fpost', json={'id': 1, 'comment': 'new comment'})
#         if post_response.status_code != 200:
#             raise FlowException("Comment was not sent :(")
#
#     @task
#     def on_start(self):  # احتمالا کار نکنه
#         self.client.post("/index.php?r=user%\2Fauth%\2Flogin", json={"username": "admin", "password": "Mosi1910"})


# from locust import HttpUser, task, between
# from bs4 import BeautifulSoup
#
#
# class HumHubUser(HttpUser):
#     wait_time = between(1, 3)  # Wait between 1 and 3 seconds after each task
#
#     @task
#     def login(self):
#         # First, get the login page to retrieve the CSRF token
#         login_page = self.client.get("/index.php?r=user%2Fauth%2Flogin")
#         soup = BeautifulSoup(login_page.text, 'html.parser')
#         csrf_token = soup.find('input', {'name': '_csrf'})['value']
#
#         # Now, perform the login
#         response = self.client.post("/index.php?r=user%2Fauth%2Flogin", data={
#             "_csrf": csrf_token,
#             "Login[username]": "admin",
#             "Login[password]": "Mosi1910",
#             "Login[rememberMe]": "1"
#         })
#
#         # Check for successful login by looking for a specific element or text
#         if "Logout" in response.text or "dashboard" in response.text:
#             print("Login successful")
#         else:
#             print("Login failed")
#
#         # Print response status code and response text for debugging purposes
#         print(f"Response status code: {response.status_code}")
#         print(response.text)
#
#         # Intentional failure check (using wrong credentials)
#         fail_response = self.client.post("/index.php?r=user%2Fauth%2Flogin", data={
#             "_csrf": csrf_token,
#             "Login[username]": "wrong_user",
#             "Login[password]": "wrong_password",
#             "Login[rememberMe]": "1"
#         })
#         if "Logout" in fail_response.text or "dashboard" in fail_response.text:
#             print("Failure test failed (unexpected success with wrong credentials)")
#         else:
#             print("Failure test passed (expected failure with wrong credentials)")
#
#
# class WebsiteUser(HttpUser):
#     tasks = [HumHubUser]
#     wait_time = between(1, 3)  # Wait between 1 and 3 seconds after each task
#
# # To run Locust, you need to have this file in the directory where you will run the command `locust`

# from locust import HttpUser, task, between
# from bs4 import BeautifulSoup
#
#
# class HumHubUser(HttpUser):
#     wait_time = between(1, 3)  # Wait between 1 and 3 seconds after each task
#
#     def on_start(self):
#         # This function will be called each time a new user (virtual user) starts
#         self.login()
#
#     def login(self):
#         # Step 1: Make a GET request to the login page to retrieve the CSRF token
#         login_page = self.client.get("/index.php?r=user%2Fauth%2Flogin")
#
#         # Step 2: Parse the HTML to find the CSRF token
#         soup = BeautifulSoup(login_page.text, 'html.parser')
#         csrf_token = soup.find('input', {'name': '_csrf'})['value']
#
#         # Step 3: Make a POST request to login using retrieved CSRF token and credentials
#         response = self.client.post("/index.php?r=user%2Fauth%2Flogin", data={
#             "_csrf": csrf_token,
#             "Login[username]": "admin",
#             "Login[password]": "Mosi1910",
#             "Login[rememberMe]": "1"
#         })
#
#         # Check if login was successful
#         if "Logout" in response.text:
#             print("Login successful")
#             self.go_to_dashboard()  # After successful login, proceed to go to the dashboard
#         else:
#             print("Login failed")
#
#     @task
#     def go_to_dashboard(self):
#         # Perform a GET request to navigate to the dashboard page
#         response = self.client.get("/index.php?r=dashboard%2Fdashboard")
#
#         # Check if the dashboard page was loaded successfully
#         if response.status_code == 200:
#             print("Navigated to dashboard successfully")
#         else:
#             print(f"Failed to navigate to dashboard. Status code: {response.status_code}")
#
#
# class WebsiteUser(HttpUser):
#     tasks = [HumHubUser]
#     wait_time = between(1, 3)  # Wait between 1 and 3 seconds after each task
#
# # To run Locust, you need to have this file in the directory where you will run the command `locust`


# پایینی خوبه فالو رو داره
# from locust import HttpUser, TaskSet, task, between
# from bs4 import BeautifulSoup
#
#
# class UserBehavior(TaskSet):
#
#     def on_start(self):
#         self.login()
#
#     def login(self):
#         # Make a GET request to the login page to retrieve the CSRF token
#         response = self.client.get("/index.php?r=user%2Fauth%2Flogin")
#
#         # Extract CSRF token from login page
#         csrf_token = self.extract_csrf_token(response.text)
#
#         # Make a POST request to login using retrieved CSRF token and credentials
#         response = self.client.post("/index.php?r=user%2Fauth%2Flogin", data={
#             "_csrf": csrf_token,
#             "Login[username]": "admin",
#             "Login[password]": "Mosi1910",
#             "Login[rememberMe]": "1"
#         })
#
#         if "Logout" in response.text:
#             print("Login successful")
#         else:
#             print("Login failed")
#
#     def extract_csrf_token(self, html_content):
#         soup = BeautifulSoup(html_content, 'html.parser')
#         csrf_token = soup.find('input', {'name': '_csrf'})['value']
#         return csrf_token
#
#     @task(1)
#     def go_to_dashboard(self):
#         response = self.client.get("/index.php?r=dashboard%2Fdashboard")
#         if response.status_code == 200:
#             print("Navigated to dashboard successfully")
#         else:
#             print(f"Failed to navigate to dashboard. Status code: {response.status_code}")
#
#     @task(2)
#     def follow_user(self):
#         # Step 1: Go to the people tab
#         people_response = self.client.get("/index.php?r=user%2Fpeople")
#
#         if people_response.status_code == 200:
#             print("Navigated to people tab successfully")
#
#             # Step 2: Visit a user's profile
#             profile_url = "/index.php?r=user%2Fprofile&cguid=cf0207ec-5178-46f1-952f-030265911a87"
#             profile_response = self.client.get(profile_url)
#
#             if profile_response.status_code == 200:
#                 print("Navigated to user profile successfully")
#
#                 # Extract CSRF token from the profile page
#                 csrf_token = self.extract_csrf_token(profile_response.text)
#
#                 # Step 3: Follow the user
#                 follow_url = "/index.php?r=user%2Fprofile%2Ffollow&cguid=cf0207ec-5178-46f1-952f-030265911a87"
#                 follow_response = self.client.post(follow_url, data={
#                     "_csrf": csrf_token
#                 })
#
#                 if follow_response.status_code == 200:
#                     print("Followed user successfully")
#                 else:
#                     print(f"Failed to follow user. Status code: {follow_response.status_code}")
#                     print(f"Response content: {follow_response.content}")
#             else:
#                 print(f"Failed to load user profile. Status code: {profile_response.status_code}")
#         else:
#             print(f"Failed to navigate to people tab. Status code: {people_response.status_code}")
#
#
# class WebsiteUser(HttpUser):
#     tasks = [UserBehavior]
#     wait_time = between(1, 3)


# پایینی بهتره علاوه بر فالو پست گذاشتن هم داره
# from locust import HttpUser, TaskSet, task, between
# from bs4 import BeautifulSoup
#
#
# class UserBehavior(TaskSet):
#
#     def on_start(self):
#         self.login()
#
#     def login(self):
#         with self.client.get("/index.php?r=user%2Fauth%2Flogin", catch_response=True) as response:
#             if response.status_code == 200:
#                 csrf_token = self.extract_csrf_token(response.text)
#                 with self.client.post("/index.php?r=user%2Fauth%2Flogin", data={
#                     "_csrf": csrf_token,
#                     "Login[username]": "admin",
#                     "Login[password]": "Mosi1910",
#                     "Login[rememberMe]": "1"
#                 }, catch_response=True) as login_response:
#                     if "Logout" in login_response.text:
#                         login_response.success()
#                         print("Login successful")
#                     else:
#                         login_response.failure("Login failed")
#                         print("Login failed")
#             else:
#                 response.failure(f"Failed to load login page. Status code: {response.status_code}")
#
#     def extract_csrf_token(self, html_content):
#         soup = BeautifulSoup(html_content, 'html.parser')
#         csrf_token = soup.find('input', {'name': '_csrf'})['value']
#         return csrf_token
#
#     @task(1)
#     def go_to_dashboard(self):
#         with self.client.get("/index.php?r=dashboard%2Fdashboard", catch_response=True) as response:
#             if response.status_code == 200:
#                 response.success()
#                 print("Navigated to dashboard successfully")
#             else:
#                 response.failure(f"Failed to navigate to dashboard. Status code: {response.status_code}")
#                 print(f"Failed to navigate to dashboard. Status code: {response.status_code}")
#
#     @task(2)
#     def follow_user(self):
#         with self.client.get("/index.php?r=user%2Fpeople", catch_response=True) as people_response:
#             if people_response.status_code == 200:
#                 people_response.success()
#                 print("Navigated to people tab successfully")
#
#                 profile_url = "/index.php?r=user%2Fprofile&cguid=cf0207ec-5178-46f1-952f-030265911a87"
#                 with self.client.get(profile_url, catch_response=True) as profile_response:
#                     if profile_response.status_code == 200:
#                         profile_response.success()
#                         print("Navigated to user profile successfully")
#
#                         csrf_token = self.extract_csrf_token(profile_response.text)
#                         follow_url = "/index.php?r=user%2Fprofile%2Ffollow&cguid=cf0207ec-5178-46f1-952f-030265911a87"
#                         with self.client.post(follow_url, data={"_csrf": csrf_token},
#                                               catch_response=True) as follow_response:
#                             if follow_response.status_code == 200:
#                                 follow_response.success()
#                                 print("Followed user successfully")
#                             else:
#                                 follow_response.failure(
#                                     f"Failed to follow user. Status code: {follow_response.status_code}")
#                                 print(f"Failed to follow user. Status code: {follow_response.status_code}")
#                                 print(f"Response content: {follow_response.content}")
#                     else:
#                         profile_response.failure(
#                             f"Failed to load user profile. Status code: {profile_response.status_code}")
#                         print(f"Failed to load user profile. Status code: {profile_response.status_code}")
#             else:
#                 people_response.failure(f"Failed to navigate to people tab. Status code: {people_response.status_code}")
#                 print(f"Failed to navigate to people tab. Status code: {people_response.status_code}")
#
#     @task(3)
#     def create_new_post(self):
#         # Step 1: Go to the space directory
#         with self.client.get("/index.php?r=space%2Fspaces", catch_response=True) as space_response:
#             if space_response.status_code == 200:
#                 space_response.success()
#                 print("Navigated to space directory successfully")
#
#                 # Step 2: Navigate to a specific space
#                 space_url = "/index.php?r=space%2Fspace&cguid=31814e33-2f3f-489c-873a-ba9512943fff"
#                 with self.client.get(space_url, catch_response=True) as specific_space_response:
#                     if specific_space_response.status_code == 200:
#                         specific_space_response.success()
#                         print("Navigated to specific space successfully")
#
#                         csrf_token = self.extract_csrf_token(specific_space_response.text)
#
#                         # Step 3: Create a new post
#                         post_url = "/index.php?r=post%2Fpost%2Fpost&cguid=31814e33-2f3f-489c-873a-ba9512943fff"
#                         post_data = {
#                             "_csrf": csrf_token,
#                             "Post[message]": "This is a test post"
#                         }
#                         with self.client.post(post_url, data=post_data, catch_response=True) as post_response:
#                             if post_response.status_code == 200:
#                                 post_response.success()
#                                 print("Post created successfully")
#                             else:
#                                 post_response.failure(
#                                     f"Failed to create post. Status code: {post_response.status_code}")
#                                 print(f"Failed to create post. Status code: {post_response.status_code}")
#                                 print(f"Response content: {post_response.content}")
#                     else:
#                         specific_space_response.failure(
#                             f"Failed to navigate to specific space. Status code: {specific_space_response.status_code}")
#                         print(
#                             f"Failed to navigate to specific space. Status code: {specific_space_response.status_code}")
#             else:
#                 space_response.failure(
#                     f"Failed to navigate to space directory. Status code: {space_response.status_code}")
#                 print(f"Failed to navigate to space directory. Status code: {space_response.status_code}")
#
#
# class WebsiteUser(HttpUser):
#     tasks = [UserBehavior]
#     wait_time = between(1, 3)


