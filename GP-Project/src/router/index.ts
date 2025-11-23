import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import SignupView from '@/views/SignupView.vue'; // Import the SignupView component
import LoginView from '@/views/LoginView.vue';
import AboutView from '@/views/AboutView.vue';
import Aboutus from '@/views/AboutUs.vue';
import PlayerView from '@/views/PlayerView.vue';
import SearchResults from '@/components/SearchResult.vue';
import ArticleDetails from '@/views/ArticleDetails.vue';
import MarketValues from '@/views/MarketValues.vue';
import UpcomingMatches from '@/components/UpcomingMatches.vue';
import TodayMatches from '@/components/TodayMatches.vue';
import Competition from '@/views/Competition.vue';
import EditProfile from '@/views/EditProfile.vue';
import Teams from '@/views/Teams.vue';
import TeamProfile from '@/views/TeamProfile.vue';
import CreatePlayer from '@/views/CreatePlayer.vue';
import PlayerValueGen from '@/views/PlayerValueGen.vue';
import WordCloud from '@/views/WordCloud.vue';
import SquadBuilderView from '@/views/SquadBuilderView.vue';
import MySquads from '@/components/MySquads.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Home Route (commented out for now)
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },

    // About Route (commented out for now)
    {
      path: '/about',
      name: 'about',
      component: Aboutus, 
    },

    // Signup Route
    {
      path: '/signup', // URL path for the signup page
      name: 'signup', // Name of the route (optional but useful for navigation)
      component: SignupView, // The component to render for this route
    },{
      path: '/login', // URL path for the signup page
      name: 'login', // Name of the route (optional but useful for navigation)
      component: LoginView, // The component to render for this route
    },{
      path: '/PlayerView/:id', // URL path for the signup page
      name: 'PlayerView', // Name of the route (optional but useful for navigation)
      component: PlayerView, // The component to render for this route
    },{
      path: '/search-results', // Add a path for search results
      name: 'SearchResults', // Name the route
      component: SearchResults, // Component to render
    },
    {
      path: "/articles/:id",
      name: "ArticleDetails",
      component: ArticleDetails,
      props: true,
    },{
      path: '/MarketValues', // Add a path for search results
      name: 'MarketValues', // Name the route
      component: MarketValues, // Component to render
    },{
      path: '/TodayMatches', // Add a path for search results
      name: 'TodayMatches', // Name the route
      component: TodayMatches, // Component to render
    },
    {
      path: "/upcoming-matches/:id",
      name: "UpcomingMatches",
      component: UpcomingMatches,
      props: true,
     },{
      path: '/Competition', // Add a path for search results
      name: 'Competition', // Name the route
      component: Competition,
     },{
      path: '/EditProfile', // Add a path for search results
      name: 'EditProfile', // Name the route
      component: EditProfile,
     },{
      path: '/Teams', // Add a path for search results
      name: 'Teams', // Name the route
      component: Teams,
     },{
      path: "/TeamProfile/:teamId",
      name: "TeamProfile",
      component: TeamProfile,
      props: true,
     },{
      path: "/CreatePlayer",
      name: "CreatePlayer",
      component: CreatePlayer,
     },{
      path: "/PlayerValueGen",
      name: "PlayerValueGen",
      component: PlayerValueGen,
     },
     {
      path: "/WordCloud",
      name: "WordCloud",
      component: WordCloud,
     },
     {
      path: "/SquadBuilderView",
      name: "SquadBuilderView",
      component: SquadBuilderView,
     }, {
      path: "/MySquads",
      name: "MySquads",
      component: MySquads,
     },
    

    // Add more routes here as needed
  ],
});

export default router;