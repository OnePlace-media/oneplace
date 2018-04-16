<template>
  <section class="main-content">
    <section class="feed container">
    
      <div class="blog__header">
        <div class="blog__header-tab blog__header-tab--active">Following</div>
        <div class="blog__header-tab">Recommended</div>
      </div>
    
      <div class="feed__wrapper">
        <div class="feed__posts">
          <article class="feed__post">
            <a href="#" class="feed__post-image" style="background-image: url('https://steemitimages.com/DQmPTUk36VFF1JKjnWF9vYRUzcp5srRqWxyshRdAcL1dAPP/Clagary%20Tower-1.jpg');"></a>
            <div class="feed__post-content">
              <div class="feed__post-reposted" style="display:none;">Reposted by<span class="feed__repost-avatar" style="background-image: url('https://steemitimages.com/u/matthewdavid/avatar');"></span><a href="#" class="link link--op">matthewdavid</a></div>
          
                <h3 class="feed__post-title h3"><a href="#" class="link">In any incomprehensible situation go travelling and find yourself some place elsewhere</a></h3>
                <p class="feed__post-text"><a href="#" class="link">Project description  OnePlace is a web-application built upon Steem and Golos blockchains. As a basis we took Vue.js with SSR. OnePlace is a web-application built upon Steem and Golos blockchains. As a basis we took Vue.js with SSR. We develop new solution to blockchain scaling.</a></p>
          
              <div class="feed__post-info">
                <div class="feed__post-author">
                  <a href="#" class="feed__post-avatar avatar" style="background-image:url(' https://steemitimages.com/72x72/https://i1.sndcdn.com/avatars-000031521646-eaz324-t500x500.jpg');"></a>
                  <div class="column-wrapper">
                    <a class="link link--op" href="#">starttheart</a>
                    <span>4 days ago</span>
                  </div>
                </div>
          
                  <div class="blog__post-data">
                    <span class="post-view__post-data-item"><span class="post-view__post-currency">$</span><span class="post-view__post-value">4.20<div class="post-view__pending-payout dropdown"><p>Pending payout is <span class="currency">$&nbsp;145.34</span> in 3 days.</p></div></span></span>
                    <span class="post-view__post-data-item">
                      <a class="post-view__post-like" title="Like">
                        <div class="spinner-rolling"><div></div></div>
                        <svg class="post-view__icon post-view__icon--small post-view__icon-like"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="img/icons-sprite.svg#like"></use></svg>
                        <div class="post-view__vote-slider-wrapper">
                          <div class="post-view__vote-slider" title="Set vote weight">
                            <div class="post-view__vote-slider-bar">
                              <div class="post-view__vote-slider-fill" style="height:36px;"></div>
                              <div class="post-view__vote-slider-handle" style="bottom:36px;"></div>
                            </div>
                          </div>
                        </div>
                      </a><span class="post-view__votes">37</span></span>
                    <span class="post-view__post-data-item"><a class="post-view__post-reply" title="Reply"><svg class="post-view__icon post-view__icon--small post-view__icon-comment"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="img/icons-sprite.svg#comment"></use></svg></a><span>227</span></span>
                  </div>
                
              </div>
            </div>
          </article>
        </div>
    
        <aside>
          <div class="feed__filters">
            <header class="feed__filters-header">
              <h4 class="h4 feed__filters-title"><svg class="icon--filter"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="img/filter.svg#icon"></use></svg>Filter by tags</h4>  
            </header>
            <div class="feed__filters-body">
              <div class="tags-filter__spinner" style="display:none;">
                <div class="spinner">
                  <div class="bounce1"></div>
                  <div class="bounce2"></div>
                  <div class="bounce3"></div>
                </div>
              </div>
              <div class="tags-list__wrapper">
                <span class="tags-list__item tags-list__item--filter tags-list__item--selected">steemit<span class="tags-list__remove-item" alt="Remove tag"></span></span>
                <span class="tags-list__item tags-list__item--filter" alt="Select tag">music<span class="tags-list__remove-item" alt="Remove tag"></span></span>
                <span class="tags-list__item tags-list__item--filter tags-list__item--removed">introduceyourself<span class="tags-list__remove-item" alt="Remove tag"></span></span>
                <span class="tags-list__item tags-list__item--filter" alt="Select tag">blockchain<span class="tags-list__remove-item" alt="Remove tag"></span></span>
                <span class="tags-list__item tags-list__item--filter" alt="Select tag">open-source<span class="tags-list__remove-item" alt="Remove tag"></span></span>
              </div>
              <div class="profile__tags-more">
                <a href="#" class="link link--inactive">Clear filters</a>
                <a href="#" class="link">Show all tags</a>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  </section>
</template>
<script>
export default {
  name:'Feed',
  asyncData({ store, route, router }) {

  }
}
</script>
