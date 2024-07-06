import requests
from bs4 import BeautifulSoup

BASE_URL = "http://localhost/humhub"

# Function to extract CSRF token
def extract_csrf_token(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')
    csrf_token = soup.find('input', {'name': '_csrf'})['value']
    return csrf_token

# Function to log in
def login(session):
    login_url = f"{BASE_URL}/index.php?r=user%2Fauth%2Flogin"
    response = session.get(login_url)
    if response.status_code == 200:
        csrf_token = extract_csrf_token(response.text)
        login_data = {
            "_csrf": csrf_token,
            "Login[username]": "admin",
            "Login[password]": "Mosi1910",
            "Login[rememberMe]": "1"
        }
        login_response = session.post(login_url, data=login_data)
        if "Logout" in login_response.text:
            print("Login successful")
            return True
        else:
            print("Login failed")
            return False
    else:
        print(f"Failed to load login page. Status code: {response.status_code}")
        return False

# Function to navigate to the dashboard
def go_to_dashboard(session):
    dashboard_url = f"{BASE_URL}/index.php?r=dashboard%2Fdashboard"
    response = session.get(dashboard_url)
    if response.status_code == 200:
        print("Navigated to dashboard successfully")
    else:
        print(f"Failed to navigate to dashboard. Status code: {response.status_code}")

# Function to follow a user
def follow_user(session):
    people_url = f"{BASE_URL}/index.php?r=user%2Fpeople"
    people_response = session.get(people_url)
    if people_response.status_code == 200:
        print("Navigated to people tab successfully")
        profile_url = f"{BASE_URL}/index.php?r=user%2Fprofile&cguid=cf0207ec-5178-46f1-952f-030265911a87"
        profile_response = session.get(profile_url)
        if profile_response.status_code == 200:
            print("Navigated to user profile successfully")
            csrf_token = extract_csrf_token(profile_response.text)
            follow_url = f"{BASE_URL}/index.php?r=user%2Fprofile%2Ffollow&cguid=cf0207ec-5178-46f1-952f-030265911a87"
            follow_response = session.post(follow_url, data={"_csrf": csrf_token})
            if follow_response.status_code == 200:
                print("Followed user successfully")
            else:
                print(f"Failed to follow user. Status code: {follow_response.status_code}")
        else:
            print(f"Failed to load user profile. Status code: {profile_response.status_code}")
    else:
        print(f"Failed to navigate to people tab. Status code: {people_response.status_code}")

# Function to create a new post
def create_new_post(session):
    space_directory_url = f"{BASE_URL}/index.php?r=space%2Fspaces"
    space_response = session.get(space_directory_url)
    if space_response.status_code == 200:
        print("Navigated to space directory successfully")
        specific_space_url = f"{BASE_URL}/index.php?r=space%2Fspace&cguid=31814e33-2f3f-489c-873a-ba9512943fff"
        specific_space_response = session.get(specific_space_url)
        if specific_space_response.status_code == 200:
            print("Navigated to specific space successfully")
            csrf_token = extract_csrf_token(specific_space_response.text)
            post_url = f"{BASE_URL}/index.php?r=post%2Fpost%2Fpost&cguid=31814e33-2f3f-489c-873a-ba9512943fff"
            post_data = {
                "_csrf": csrf_token,
                "Post[message]": "This is a test post"
            }
            post_response = session.post(post_url, data=post_data)
            if post_response.status_code == 200:
                print("Post created successfully")
            else:
                print(f"Failed to create post. Status code: {post_response.status_code}")
        else:
            print(f"Failed to navigate to specific space. Status code: {specific_space_response.status_code}")
    else:
        print(f"Failed to navigate to space directory. Status code: {space_response.status_code}")

# Function to post a comment
def post_comment(session):
    space_url = f"{BASE_URL}/index.php?r=space%2Fspace&cguid=31814e33-2f3f-489c-873a-ba9512943fff"
    space_response = session.get(space_url)
    if space_response.status_code == 200:
        print("Navigated to specific space successfully")
        soup = BeautifulSoup(space_response.text, 'html.parser')
        post_div = soup.find('div', {'id': 'h667966w6'})
        if post_div:
            csrf_token = extract_csrf_token(space_response.text)
            object_model = 'humhub\\modules\\post\\models\\Post'
            object_id = "718"
            comment_url = f"{BASE_URL}/index.php?r=comment%2Fcomment%2Fpost"
            comment_data = {
                "_csrf": csrf_token,
                "objectModel": object_model,
                "objectId": object_id,
                "message": "This is an automated comment from a script."
            }
            comment_response = session.post(comment_url, data=comment_data)
            if comment_response.status_code == 200:
                print("Comment posted successfully")
            else:
                print(f"Failed to post comment. Status code: {comment_response.status_code}")
        else:
            print("Failed to find the post div.")
    else:
        print(f"Failed to navigate to specific space. Status code: {space_response.status_code}")

# Function to log out
def logout(session):
    logout_url = f"{BASE_URL}/index.php?r=user%2Fauth%2Flogout"
    response = session.post(logout_url)
    if response.status_code == 200:
        print("Logged out successfully")
    else:
        print(f"Failed to log out. Status code: {response.status_code}")

# Main function to run all tasks
def main():
    with requests.Session() as session:
        if login(session):
            go_to_dashboard(session)
            follow_user(session)
            create_new_post(session)
            post_comment(session)
            logout(session)

if __name__ == "__main__":
    main()
