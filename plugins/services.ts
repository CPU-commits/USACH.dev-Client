// Services
import { Fetch } from '~~/common/fetchModule'
import { AuthService } from '~~/services/auth.service'
import { DiscussionService } from '~~/services/discussion.service'
import { FilesService } from '~~/services/files.service'
import { RepoSerivce } from '~~/services/repo.service'
import { UserService } from '~~/services/user.service'

export default defineNuxtPlugin(() => {
	const fetchModule = new Fetch()
	const fileService = new FilesService()
	return {
		provide: {
			fetchModule,
			authService: new AuthService(fetchModule),
			userService: new UserService(fetchModule),
			repoService: new RepoSerivce(fetchModule, fileService),
			discussionService: new DiscussionService(fetchModule),
		},
	}
})
